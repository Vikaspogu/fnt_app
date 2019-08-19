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
  classNames,
  Visibility,
  cellWidth
} from '@patternfly/react-table';
import { PlusCircleIcon, CheckCircleIcon, ErrorCircleOIcon } from '@patternfly/react-icons';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  changeTopic,
  changePresenter,
  changeLocation,
  changeDate,
  changeAddInfo,
  changeMobNotification,
  useIdState, useModalState
} from '@app/utils/commonState';

const SCRAPE_URL = process.env.SCRAPE_URL || 'http://localhost:3000/';

const TechTalks: React.FunctionComponent<any> = () => {
  const {topic, setTopic, handleTextInputChangeTopic} = changeTopic();
  const {presenter, setPresenter, handleTextInputChangePresenter} = changePresenter();
  const {location, setLocation, handleTextInputChangeLocation} = changeLocation();
  const {date, setDate, handleTextInputChangeDate} = changeDate();
  const {addiInfo, setAddiInfo, handleTextInputChangeAddInfo} = changeAddInfo();
  const {mobileNotify, setMobileNotify, handleTextInputChangeMobNotification} = changeMobNotification();
  const {id, setId} = useIdState();
  const {isModalOpen, setIsModalOpen} = useModalState();

  const [columns] = useState([
    { title: 'Id', columnTransforms: [classNames(Visibility.hidden)]},
    { title: 'Topic', cellTransforms: [headerCol()], transforms: [cellWidth(20)]},
    'Presenter',
    'Location',
    'When',
    { title: 'MobileVal', columnTransforms: [classNames(Visibility.hidden)] },
    'Mobile',
    'Information']);
  const [actions] = useState([
    {
      title: 'Edit',
      onClick: (event, rowId, rowData) => {
        console.log(rowData.when.title);
        setId(rowData.id.title);
        setTopic(rowData.topic.title);
        setPresenter(rowData.presenter.title);
        setLocation(rowData.location.title);
        setDate(moment(rowData.when.title, "MMMM D, YYYY, h:mm a").toDate());
        setAddiInfo(rowData.information.title);
        setMobileNotify(rowData.mobileval.title);
        setIsModalOpen(true);
      },
    },
    { isSeparator: true, title: 'Seperator', onClick:(): void => {} },
    {
      title: 'Delete',
      onClick: (event, rowId, rowData): void => {
        axios.delete('techtalk/' + rowData.id.title).then(() => getTechTalks())
      },
    },
  ]);
  const [rows, setRows] = useState([]);

  const handleModalToggle = () => {
    setId('');
    setTopic('');
    setPresenter('');
    setLocation('');
    setDate('');
    setAddiInfo('');
    setMobileNotify(false);
    setIsModalOpen(!isModalOpen);
  };
  const getTechTalks = () => {
    axios.get('alltechtalks').then((res) => {
      const techTalkRows = [];
      res.data && res.data.map(data => {
        const cells= [
          data.id,
          data.topic,
          data.presenter,
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
        techTalkRows = [...techTalkRows, cells];
      });
      setRows(techTalkRows);
    });
  };
  const addUpdateTechTalk = () => {
    if (topic === '' || presenter === '' || location === '' || date === undefined) {
      return;
    }
    if (id !== '') {
      axios.put('updatetechtalk', {
        id,
        topic,
        presenter,
        location,
        date,
        additionalInfo: addiInfo,
        mobileNotify: mobileNotify,
      }).then(() => {
        setIsModalOpen(!isModalOpen);
        getTechTalks();
      });
    } else {
      axios.post('techtalk', {
        topic,
        presenter,
        location,
        date,
        additionalInfo: addiInfo,
        mobileNotify: mobileNotify,
      }).then(res => {
        setIsModalOpen(!isModalOpen);
        getTechTalks();
        updateImageTechTalk(res.data.topic, res.data.id);
      });
    }
  };
  const updateImageTechTalk = (keyword, id) => {
    axios.get(SCRAPE_URL.concat('scrape/'+keyword)).then(res => {
      axios.put('updatetechimg', {
        id,
        photoUri: res.data
      }).then(()=> console.log('success')).catch(() => console.warn("Couldn't fetch image"));
    })
  };

  useEffect(() => {
    getTechTalks()
  },[]);

  return (
    <React.Fragment>
    <PageSection>
      <TextContent>
        <Text component="h1">Upcoming Tech Talks</Text>
      </TextContent>
      <Button variant="primary" onClick={handleModalToggle}>
        <PlusCircleIcon /> Add Tech Talk
      </Button>
    </PageSection>
    <PageSection>
      <Table aria-label="header" actions={actions} cells={columns} rows={rows}>
        <TableHeader />
        <TableBody />
      </Table>
      <Modal
        isLarge
        title={id !== '' ? 'Update Tech Talk' : 'Add Tech Talk'}
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
            onClick={addUpdateTechTalk}
          >
            {id !== '' ? 'Update' : 'Submit'}
          </Button>,
        ]}
      >
        <Form isHorizontal>
          <FormGroup
            label="Topic"
            isRequired
            helperTextInvalid="Enter event's topic"
            isValid={topic !== ''}
            fieldId="horizontal-form-topic"
          >
            <TextInput
              value={topic}
              isRequired
              isValid={topic !== ''}
              type="text"
              id="horizontal-form-topic"
              aria-describedby="horizontal-form-topic-helper"
              name="horizontal-form-topic"
              onChange={handleTextInputChangeTopic}
            />
          </FormGroup>
          <FormGroup
            label="Presenter"
            isRequired
            fieldId="horizontal-form-name"
            helperTextInvalid="Enter name of presenter"
            isValid={presenter !== ''}
          >
            <TextInput
              value={presenter}
              isRequired
              isValid={presenter !== ''}
              type="text"
              id="horizontal-form-name"
              aria-describedby="horizontal-form-name-helper"
              name="horizontal-form-name"
              onChange={handleTextInputChangePresenter}
            />
          </FormGroup>
          <FormGroup
            label="Location"
            isRequired
            fieldId="horizontal-form-email"
            helperTextInvalid="Enter event's location"
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
            label="Date & Time"
            isRequired
            helperTextInvalid="Enter event's date & time"
            isValid={date !== undefined}
            fieldId="horizontal-form-date"
          >
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
              type="text"
              id="horizontal-form-exp"
            />
          </FormGroup>
          <FormGroup fieldId="horizontal-form-checkbox">
            <Checkbox
              label="Send mobile notification"
              id="send-noti-checkbox"
              name="send-noti-checkbox"
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

export { TechTalks };
