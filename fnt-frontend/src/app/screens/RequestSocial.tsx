import React, {useEffect, useState} from 'react';
import {
  Button,
  Checkbox,
  Form,
  FormGroup,
  Modal,
  PageSection,
  PageSectionVariants,
  Text,
  TextArea,
  TextContent,
  TextInput,
} from '@patternfly/react-core';
import {cellWidth, classNames, headerCol, Table, TableBody, TableHeader, Visibility,} from '@patternfly/react-table';
import {CheckCircleIcon, ErrorCircleOIcon} from '@patternfly/react-icons';
import axios from '@app/utils/api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {useModalState, useStateSocialEvent, useVotesState} from '@app/utils/commonState';
import moment from "moment";

const RequestSocial: React.FunctionComponent<any> = () => {
  const {
    socialEvent, setSocialEvent, handleTextInputChangeDate,
    handleTextInputChangeAddInfo, handleTextInputChangeMobNotification,
    handleTextInputChangeLocation, handleTextInputChangePlace
  } = useStateSocialEvent();
  const {setVotes} = useVotesState();
  const {isModalOpen, setIsModalOpen} = useModalState();
  const [photoUri, setPhotoUri] = useState<string>();

  const [columns] = useState([
      {
      title: 'Id', columnTransforms: [classNames(Visibility.hidden)],
      },
      {
        title: 'PhotoUri', columnTransforms: [classNames(Visibility.hidden)],
      },
      {
        title: 'Place', cellTransforms: [headerCol()], transforms: [cellWidth(20)],
      },
      'Location',
      'Votes',
      'Promoted',
      'Information']);
  const [actions] = useState([
    {
      title: 'Promote to Upcoming',
      onClick: (event, rowId, rowData) => {
        setSocialEvent({
          id: rowData.id.title,
          place: rowData.place.title,
          location: rowData.location.title,
          date: '',
          addiInfo: rowData.information.title,
          mobileNotify: false
        });
        setVotes(rowData.votes.title);
        setIsModalOpen(!isModalOpen);
        setPhotoUri(rowData.photouri.title);
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
  const getAllRequestedSocialEvents = () => {
    axios.get('allrequestedsocial').then(res => {
      let reqSocialEventsRow: any[] = [];
      res.data && res.data.map(data => {
        let cells: any[] = [
          data.id,
          data.photoUri,
          data.place,
          data.location,
          data.votes !== null ? data.votes.length : 0,
          {
            title: (
              <React.Fragment>
                {data.promoted ? <CheckCircleIcon key="icon" color="green"/> : <ErrorCircleOIcon key="icon"/>}
              </React.Fragment>
            )
          },
          data.additionalInfo,
        ];
        reqSocialEventsRow = [...reqSocialEventsRow, { "cells" : cells }];
      });
      setRows(reqSocialEventsRow)
    });
  };

  const promoteSocialEvent = () => {
    axios.post('socialevent', {
      place: socialEvent.place,
      location: socialEvent.location,
      date: socialEvent.date,
      additionalInfo: socialEvent.addiInfo,
      mobileNotify: socialEvent.mobileNotify,
      photoUri: photoUri,
    }).then(() => {
      axios.put('updaterequestedsocial/'+ socialEvent.id, {
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
        <Table aria-label="table" actions={actions} cells={columns} rows={rows}>
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
            <FormGroup label="Date" isRequired fieldId="horizontal-form-date"
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

export {RequestSocial};
