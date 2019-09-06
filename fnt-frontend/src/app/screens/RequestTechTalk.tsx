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
import {useStateTechTalk} from '@app/utils/commonState';

const RequestTechTalk: React.FunctionComponent<any> = () => {
  const {
    setTechTalk, handleTextInputChangeMobNotification, handleTextInputChangeAddInfo,
    handleTextInputChangeDate, handleTextInputChangePresenter, handleTextInputChangeTopic, techTalk
  } = useStateTechTalk();
  const [votes, setVotes] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [photoUri, setPhotoUri] = useState<string>();

  const [columns] = useState([
    {
      title: 'Id', columnTransforms: [classNames(Visibility.hidden)],
    },
    {
      title: 'PhotoUri', columnTransforms: [classNames(Visibility.hidden)],
    },
    {
      title: 'Topic', cellTransforms: [headerCol()], transforms: [cellWidth(20)],
    },
    'Presenter',
    'Votes',
    'Promoted',
    'Information']);
  const [actions] = useState([
    {
      title: 'Promote to Upcoming',
      onClick: (event, rowId, rowData) => {
        console.log(rowData);
        setTechTalk({
          id: rowData.id.title,
          topic: rowData.topic.title,
          presenter: rowData.presenter.title,
          date: '',
          addiInfo: rowData.information.title,
          mobileNotify: false
        });
        setVotes(rowData.votes.title);
        setIsModalOpen(true);
        setPhotoUri(rowData.photouri.title);
      },
    },
    {
      isSeparator: true, title: 'Separator', onClick: () => {}
    },
    {
      title: 'Delete',
      onClick: (event, rowId, rowData) => {
        axios.delete('requestedtalk/' + rowData.id.title).then(() => getAllRequestedTechEvents())
      }
    },
  ]);
  const [rows, setRows] = useState<any[]>([]);

  const handleModalToggle = () => {
    setTechTalk({
      id: '',
      topic: '',
      presenter: '',
      date: '',
      addiInfo: '',
      mobileNotify: false
    });
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    getAllRequestedTechEvents()
  }, []);

  const getAllRequestedTechEvents = () => {
    axios.get('allrequestedtalk').then(res => {
      let reqTechEventsRow: any[] = [];
      res.data && res.data.map(data => {
        let cells: any[] = [
          data.id,
          data.photoUri,
          data.topic,
          data.presenter,
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
        reqTechEventsRow = [...reqTechEventsRow, {"cells": cells}];
      });
      setRows(reqTechEventsRow)
    });
  };

  const promoteTechEvent = () => {
    axios.post('techtalk', {
      topic: techTalk.topic,
      presenter: techTalk.presenter,
      date: techTalk.date,
      additionalInfo: techTalk.addiInfo,
      mobileNotify: techTalk.mobileNotify,
      photoUri: photoUri,
    }).then(() => {
      axios.put('updaterequestedtalk/'+techTalk.id , {
        promoted: true,
      }).then(() => {
        setIsModalOpen(!isModalOpen);
        getAllRequestedTechEvents();
      })
    })
  };
  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Requested Tech Talk</Text>
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
              onClick={promoteTechEvent}
            >
              Promote</Button>,
          ]}
        >
          <Form isHorizontal>
            <FormGroup
              label="Topic"
              isRequired
              fieldId="horizontal-form-name"
              helperTextInvalid="Enter topic's name"
              isValid={techTalk.topic !== ''}
            >
              <TextInput
                value={techTalk.topic}
                isRequired
                isValid={techTalk.topic !== ''}
                type="text"
                id="horizontal-form-name"
                aria-describedby="horizontal-form-name-helper"
                name="horizontal-form-name"
                onChange={handleTextInputChangeTopic}
              />
            </FormGroup>
            <FormGroup
              label="Presenter"
              isRequired
              fieldId="horizontal-form-email"
              helperTextInvalid="Enter topic's presenter"
              isValid={techTalk.presenter !== ''}
            >
              <TextInput
                value={techTalk.presenter}
                onChange={handleTextInputChangePresenter}
                isRequired
                isValid={techTalk.presenter !== ''}
                type="email"
                id="horizontal-form-email"
                name="horizontal-form-email"
              />
            </FormGroup>
            <FormGroup label="Date" isRequired fieldId="horizontal-form-date"
                       helperTextInvalid="Enter event date & time"
                       isValid={techTalk.date !== ''}>
              <DatePicker
                selected={techTalk.date}
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
                value={techTalk.addiInfo}
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
                isChecked={techTalk.mobileNotify}
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

export {RequestTechTalk};

