import React, {useEffect, useState} from 'react';
import {
  PageSection,
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
import { PlusCircleIcon, CheckCircleIcon, ErrorCircleOIcon } from '@patternfly/react-icons';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import {
  changePlace,
  changeLocation,
  changeDate,
  changeAddInfo,
  changeMobNotification, useIdState, useModalState,
} from '@app/utils/commonState';


const SCRAPE_URL = process.env.SCRAPE_URL || 'http://localhost:3000/';

const SocialEvents: React.FunctionComponent<any> = () => {
  const {place, setPlace, handleTextInputChangePlace} = changePlace();
  const {location, setLocation, handleTextInputChangeLocation} = changeLocation();
  const {date, setDate, handleTextInputChangeDate} = changeDate();
  const {addiInfo, setAddiInfo, handleTextInputChangeAddInfo} = changeAddInfo();
  const {mobileNotify, setMobileNotify, handleTextInputChangeMobNotification} = changeMobNotification();
  const {id, setId} = useIdState();
  const {isModalOpen, setIsModalOpen} = useModalState();

  const [columns] = useState([
    { title: 'Id', columnTransforms: [classNames(Visibility.hidden)]},
    { title: 'Place', cellTransforms: [headerCol()], transforms: [cellWidth(20)]},
    'Location',
    'When',
    { title: 'MobileVal', columnTransforms: [classNames(Visibility.hidden)] },
    'Mobile',
    'Information']);
  const [actions] = useState([
    {
      title: 'Edit',
      onClick: (event, rowId, rowData) => {
        setId(rowData.id.title);
        setPlace(rowData.place.title);
        setLocation(rowData.location.title);
        setDate(moment(rowData.when.title, "MMMM D, YYYY, h:mm a").toDate());
        setAddiInfo(rowData.information.title);
        setMobileNotify(rowData.mobileval.title);
        setIsModalOpen(true);
      },
    },
    { isSeparator: true, title: 'Separator', onClick:(): void => {} },
    {
      title: 'Delete',
      onClick: (event, rowId, rowData): void => {
        axios.delete('socialevent/' + rowData.id.title).then(() => getSocialEvents())
      },
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

  const getSocialEvents = () => {
    axios.get('allsocialevents').then((res) => {
      let socialEventRows = [];
      res.data && res.data.map(data => {
        const cells = [
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
                {data.mobileNotify ? <CheckCircleIcon key="icon" color="green"/> : <ErrorCircleOIcon key="icon"/> }
              </React.Fragment>
            )
          },
          data.additionalInfo,
        ];
        // @ts-ignore
        socialEventRows = [...socialEventRows, cells];
      });
      setRows(socialEventRows);
    });
  };
  const addUpdateSocialEvent = () => {
    if (place === '' ||  location === '' || date === undefined) {
      return;
    }
    if (id !== '') {
      axios.put('updatesocialevent', {
        id,
        place,
        location,
        date,
        additionalInfo: addiInfo,
        mobileNotify: mobileNotify,
      }).then(() => {
        setIsModalOpen(!isModalOpen);
        getSocialEvents();
      });
    } else {
      axios.post('socialevent', {
        place,
        location,
        date,
        additionalInfo: addiInfo,
        mobileNotify: mobileNotify,
      }).then(res => {
        setIsModalOpen(!isModalOpen);
        getSocialEvents();
        updateImageTechTalk(res.data.place, res.data.id);
      });
    }
  };
  const updateImageTechTalk = (keyword, id) => {
    axios.get(SCRAPE_URL.concat('scrape/'+keyword)).then(res => {
      axios.put('updatetechimg', {
        id,
        photoUri: res.data
      }).then(() => console.log("success")).catch(() => console.warn("Couldn't fetch image"));
    })
  };

  useEffect(() => {
    getSocialEvents()
  },[]);

  return (
    <React.Fragment>
      <PageSection>
        <TextContent>
          <Text component="h1">Upcoming Social Events</Text>
        </TextContent>
        <Button variant="primary" onClick={handleModalToggle}>
          <PlusCircleIcon /> Add Social Event
        </Button>
      </PageSection>
      <PageSection>
        <Table aria-label="header" actions={actions} cells={columns} rows={rows}>
          <TableHeader />
          <TableBody />
        </Table>
        <Modal
          isLarge
          title={id !== '' ? 'Update Social Event' : 'Add Social Event'}
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
              {id !== '' ? 'Update' : 'Submit'}
            </Button>,
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
            <FormGroup
              label="Date"
              isRequired
              fieldId="horizontal-form-date"
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

export { SocialEvents };
