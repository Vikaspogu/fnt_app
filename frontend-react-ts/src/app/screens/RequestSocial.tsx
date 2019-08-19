import React, {useEffect, useState} from 'react';
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  Button,
  Modal,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Checkbox,
} from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  headerCol,
  cellWidth,
  classNames,
  Visibility,
} from '@patternfly/react-table';
import {CheckCircleIcon, ErrorCircleOIcon} from '@patternfly/react-icons';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  changePlace,
  changeLocation,
  changeDate,
  changeAddInfo,
  changeMobNotification,
  useIdState,
  useVotesState,
  useModalState
} from '@app/utils/commonState';

const RequestSocial: React.FunctionComponent<any> = () => {
  const {place, setPlace, handleTextInputChangePlace} = changePlace();
  const {location, setLocation, handleTextInputChangeLocation} = changeLocation();
  const {date, setDate, handleTextInputChangeDate} = changeDate();
  const {addiInfo, setAddiInfo, handleTextInputChangeAddInfo} = changeAddInfo();
  const {mobileNotify, setMobileNotify, handleTextInputChangeMobNotification} = changeMobNotification();
  const {id, setId} = useIdState();
  const {setVotes} = useVotesState();
  const {isModalOpen, setIsModalOpen} = useModalState();

  const [columns] = useState(
    [{
      title: 'Id', columnTransforms: [classNames(Visibility.hidden)],
    },
      {
        title: 'Place', cellTransforms: [headerCol()], transforms: [cellWidth(20)],
      },
      'Location',
      'Votes',
      'Promoted',
      'Additional Information']);
  const [actions] = useState([
    {
      title: 'Promote to Upcoming',
      onClick: (event, rowId, rowData) => {
        setId(rowData.id.title);
        setPlace(rowData.place.title);
        setLocation(rowData.location.title);
        setVotes(rowData.votes.title);
        setDate('');
        setAddiInfo(rowData[5]);
        setMobileNotify(true);
      },
    },
    {
      isSeparator: true, title: 'Separator', onClick: () => {
      }
    },
    {
      title: 'Delete',
      onClick: (event, rowId, rowData) => {
        axios.delete('requestedsocial/' + rowData.id.title).then(() => getAllRequestedSocialEvents())
      }
    },
  ]);
  const [rows, setRows] = useState([]);
  const handleModalToggle = () => {
    setId('');
    setPlace('');
    setLocation('');
    setDate('');
    setAddiInfo('');
    setMobileNotify(false);
    setIsModalOpen(!isModalOpen);
  };
  const getAllRequestedSocialEvents = () => {
    axios.get('allrequestedsocial').then(res => {
      let reqSocialEventsRow = [];
      res.data && res.data.map(data => {
        let cells = [
          data.id,
          data.place,
          data.location,
          data.votes !== [] ? data.votes.length : 0,
          {
            title: (
              <React.Fragment>
                {data.promoted ? <CheckCircleIcon key="icon" color="green"/> : <ErrorCircleOIcon key="icon"/>}
              </React.Fragment>
            )
          },
          data.additionalInfo,
        ];
        // @ts-ignore
        reqSocialEventsRow = [...reqSocialEventsRow, cells];
      });
      setRows(reqSocialEventsRow)
    });
  };

  const promoteSocialEvent = () => {
    axios.post('socialevent', {
      place,
      location,
      date,
      additionalInfo: addiInfo,
      mobileNotify,
    }).then(() => {
      axios.put('promotesocialrequest', {
        id,
        promoted: true,
      }).then(() => {
        setIsModalOpen(!isModalOpen);
        getAllRequestedSocialEvents();
      })
    })
  };
  useEffect(() => {
    getAllRequestedSocialEvents()
  }, []);
  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Requested Social Events</Text>
        </TextContent>
      </PageSection>
      <PageSection type="nav" style={{height: '80vh'}} isFilled={true}>
        <Table actions={actions} cells={columns} rows={rows}>
          <TableHeader/>
          <TableBody/>
        </Table>
        <Modal
          isLarge
          title='Promote to Upcoming Social Event'
          isOpen={isModalOpen}
          onClose={handleModalToggle}
          actions={[
            <Button
              key="cancel"
              variant="secondary"
              onClick={handleModalToggle}
            >
              Cancel</Button>,
            <Button
              key="confirm"
              variant="primary"
              onClick={promoteSocialEvent}
            >
              Promote</Button>,
          ]}
        >
          <Form isHorizontal>
            <FormGroup
              label="Place"
              isRequired
              fieldId="horizontal-form-name"
              helperTextInvalid="Enter place's name"
              isValid={place !== ''}
            >
              <TextInput
                value={place}
                isRequired
                isValid={place !== ''}
                type="text"
                id="horizontal-form-name"
                aria-describedby="horizontal-form-name-helper"
                name="horizontal-form-name"
                onChange={handleTextInputChangePlace}
              />
            </FormGroup>
            <FormGroup
              label="Location"
              isRequired
              fieldId="horizontal-form-email"
              helperTextInvalid="Enter place's location"
              isValid={location !== ''}
            >
              <TextInput
                value={location}
                onChange={handleTextInputChangeLocation}
                isRequired
                isValid={location !== ''}
                type="email"
                id="horizontal-form-email"
                name="horizontal-form-email"
              />
            </FormGroup>
            <FormGroup label="Date" isRequired fieldId="horizontal-form-date"
                       helperTextInvalid="Enter event date & time"
                       isValid={date !== ''}>
              <DatePicker
                selected={date}
                onChange={handleTextInputChangeDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
                timeCaption="time"
              />
            </FormGroup>
            <FormGroup
              label="Additional Information"
              fieldId="horizontal-form-exp"
            >
              <TextArea
                value={addiInfo}
                onChange={handleTextInputChangeAddInfo}
                name="horizontal-form-exp"
                id="horizontal-form-exp"
              />
            </FormGroup>
            <FormGroup fieldId="horizontal-form-checkbox">
              <Checkbox
                label="Send mobile notification"
                id="alt-form-checkbox-1"
                name="alt-form-checkbox-1"
                isChecked={mobileNotify}
                aria-label="send-noti-checkbox"
                onChange={handleTextInputChangeMobNotification}
              />
            </FormGroup>
          </Form>
        </Modal>
      </PageSection>
    </React.Fragment>
  );
};

export {RequestSocial};
