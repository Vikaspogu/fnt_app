import React, {useEffect, useState} from 'react';
import {
  Button,
  Checkbox,
  Form,
  FormGroup,
  Modal,
  PageSection,
  Text,
  TextArea,
  TextContent,
  TextInput,
} from '@patternfly/react-core';
import {cellWidth, classNames, headerCol, Table, TableBody, TableHeader, Visibility,} from '@patternfly/react-table';
import {CheckCircleIcon, ErrorCircleOIcon, PlusCircleIcon} from '@patternfly/react-icons';
import axios from '@app/utils/api';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import {useModalState, useStateSocialEvent,} from '@app/utils/commonState';


const SCRAPE_URL = process.env.SCRAPE_URL || 'http://localhost:3000/';

const SocialEvents: React.FunctionComponent<any> = () => {
  const {
    socialEvent, setSocialEvent, handleTextInputChangeDate,
    handleTextInputChangeAddInfo, handleTextInputChangeMobNotification,
    handleTextInputChangeLocation, handleTextInputChangePlace
  } = useStateSocialEvent();
  const {isModalOpen, setIsModalOpen} = useModalState();

  const [columns] = useState([
    {title: 'Id', columnTransforms: [classNames(Visibility.hidden)]},
    {title: 'Place', cellTransforms: [headerCol()], transforms: [cellWidth(20)]},
    'Location',
    'When',
    {title: 'MobileVal', columnTransforms: [classNames(Visibility.hidden)]},
    'Mobile',
    'Information']);
  const [actions] = useState([
    {
      title: 'Edit',
      onClick: (event, rowId, rowData) => {
        setSocialEvent({
          id: rowData.id.title,
          place: rowData.place.title,
          location: rowData.location.title,
          date: moment(rowData.when.title, "MMMM D, YYYY, h:mm a").toDate(),
          addiInfo: rowData.information.title,
          mobileNotify: rowData.mobileval.title
        });
        setIsModalOpen(true);
      },
    },
    {
      isSeparator: true, title: 'Separator', onClick: (): void => {
      }
    },
    {
      title: 'Delete',
      onClick: (event, rowId, rowData): void => {
        axios.delete('socialevent/' + rowData.id.title).then(() => getSocialEvents())
      },
    },
  ]);
  const [rows, setRows] = useState<any[]>([]);

  const handleModalToggle = () => {
    setSocialEvent({
      id: '',
      place: '',
      location: '',
      date: '',
      addiInfo: '',
      mobileNotify: false
    });
    setIsModalOpen(!isModalOpen);
  };

  const getSocialEvents = () => {
    axios.get('allsocialevents').then((res) => {
      let socialEventRows: any[] = [];
      res.data && res.data.map(data => {
        const cells: any[] = [
          data.id,
          data.place,
          data.location,
          moment(data.date, 'YYYY-MM-DDThh:mm').format(
            'MMMM D, YYYY, h:mm a'
          ),
          data.mobileNotify,
          {
            title: (
              <React.Fragment>
                {data.mobileNotify ? <CheckCircleIcon key="icon" color="green"/> : <ErrorCircleOIcon key="icon"/>}
              </React.Fragment>
            )
          },
          data.additionalInfo,
        ];
        socialEventRows = [...socialEventRows, cells];
      });
      setRows(socialEventRows);
    });
  };
  const addUpdateSocialEvent = () => {
    if (socialEvent.place === '' || socialEvent.location === '' || socialEvent.date === undefined) {
      return;
    }
    if (socialEvent.id !== '') {
      axios.put('updatesocialevent', {
        id: socialEvent.id,
        place: socialEvent.place,
        location: socialEvent.location,
        date: socialEvent.date,
        additionalInfo: socialEvent.addiInfo,
        mobileNotify: socialEvent.mobileNotify,
      }).then(() => {
        setIsModalOpen(!isModalOpen);
        getSocialEvents();
      });
    } else {
      axios.post('socialevent', {
        place: socialEvent.place,
        location: socialEvent.location,
        date: socialEvent.date,
        additionalInfo: socialEvent.addiInfo,
        mobileNotify: socialEvent.mobileNotify,
      }).then(res => {
        setIsModalOpen(!isModalOpen);
        getSocialEvents();
        updateImageTechTalk(res.data.place, res.data.id);
      });
    }
  };
  const updateImageTechTalk = (keyword, id) => {
    axios.get(SCRAPE_URL.concat('scrape/' + keyword)).then(res => {
      axios.put('updatetechimg', {
        id,
        photoUri: res.data.uri
      }).then(() => console.log("success")).catch(() => console.warn("Couldn't fetch image"));
    })
  };

  useEffect(() => {
    getSocialEvents()
  }, []);

  return (
    <React.Fragment>
      <PageSection>
        <TextContent>
          <Text component="h1">Upcoming Social Events</Text>
        </TextContent>
        <Button variant="primary" onClick={handleModalToggle}>
          <PlusCircleIcon/> Add Social Event
        </Button>
      </PageSection>
      <PageSection>
        <Table aria-label="header" actions={actions} cells={columns} rows={rows}>
          <TableHeader/>
          <TableBody/>
        </Table>
        <Modal
          isLarge
          title={socialEvent.id !== '' ? 'Update Social Event' : 'Add Social Event'}
          isOpen={isModalOpen}
          onClose={handleModalToggle}
          actions={[
            <Button
              key="cancel"
              variant="secondary"
              onClick={handleModalToggle}
            >
              Cancel
            </Button>,
            <Button
              key="confirm"
              variant="primary"
              onClick={addUpdateSocialEvent}
            >
              {socialEvent.id !== '' ? 'Update' : 'Submit'}
            </Button>,
          ]}
        >
          <Form isHorizontal>
            <FormGroup
              label="Place"
              isRequired
              fieldId="horizontal-form-name"
              helperTextInvalid="Enter place's name"
              isValid={socialEvent.place !== ''}
            >
              <TextInput
                value={socialEvent.place}
                isRequired
                isValid={socialEvent.place !== ''}
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
              isValid={socialEvent.location !== ''}
            >
              <TextInput
                value={socialEvent.location}
                onChange={handleTextInputChangeLocation}
                isRequired
                isValid={socialEvent.location !== ''}
                type="email"
                id="horizontal-form-email"
                name="horizontal-form-email"
              />
            </FormGroup>
            <FormGroup
              label="Date"
              isRequired
              fieldId="horizontal-form-date"
              helperTextInvalid="Enter event date & time"
              isValid={socialEvent.date !== ''}>
              <DatePicker
                selected={socialEvent.date}
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
                value={socialEvent.addiInfo}
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
                isChecked={socialEvent.mobileNotify}
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

export {SocialEvents};
