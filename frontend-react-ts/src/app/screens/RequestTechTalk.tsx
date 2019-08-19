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
import {changeTopic,changePresenter,changeDate,changeAddInfo,changeMobNotification } from '@app/utils/commonState';

const RequestTechTalk: React.FunctionComponent<any> = (props) => {
  const {topic, setTopic, handleTextInputChangeTopic} = changeTopic();
  const {presenter, setPresenter, handleTextInputChangePresenter} = changePresenter();
  const {date, setDate, handleTextInputChangeDate} = changeDate();
  const {addiInfo, setAddiInfo, handleTextInputChangeAddInfo} = changeAddInfo();
  const {mobileNotify, setMobileNotify, handleTextInputChangeMobNotification} = changeMobNotification();

  const [id, setId] = useState<string>('');
  const [votes, setVotes] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [columns] = useState([
      {
      title: 'Id', columnTransforms: [classNames(Visibility.hidden)],
      },
      {
        title: 'Topic', cellTransforms: [headerCol()], transforms: [cellWidth(20)],
      },
      'Presenter',
      'Votes',
      'Promoted',
      'Additional Information']);
  const [actions] = useState([
    {
      title: 'Promote to Upcoming',
      onClick: (event, rowId, rowData, extra) => {
        setId(rowData.id.title);
        setTopic(rowData.topic.title);
        setPresenter(rowData.presenter.title);
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
        axios.delete('requestedtalk/' + rowData.id.title).then(() => getAllRequestedTechEvents())
      }
    },
  ]);
  const [rows, setRows] = useState([]);

  const handleModalToggle = () => {
    setId('');
    setTopic('');
    setPresenter('');
    setDate('');
    setAddiInfo('');
    setMobileNotify(false);
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    getAllRequestedTechEvents()
  }, []);

  const getAllRequestedTechEvents = () => {
    axios.get('allrequestedtalk').then(res => {
      let reqTechEventsRow = [];
      res.data && res.data.map(data => {
        let cells = [
          data.id,
          data.topic,
          data.presenter,
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
        reqTechEventsRow = [...reqTechEventsRow, cells];
      });
      setRows(reqTechEventsRow)
    });
  };

  const promoteTechEvent = () => {
    axios.post('techtalk', {
      topic,
      presenter,
      date,
      additionalInfo: addiInfo,
      mobileNotify,
    }).then(() => {
      axios.put('promoterequesttalk', {
        id,
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
              isValid={topic !== ''}
            >
              <TextInput
                value={topic}
                isRequired
                isValid={topic !== ''}
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
              isValid={presenter !== ''}
            >
              <TextInput
                value={presenter}
                onChange={handleTextInputChangePresenter}
                isRequired
                isValid={presenter !== ''}
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

export {RequestTechTalk};

