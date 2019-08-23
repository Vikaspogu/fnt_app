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
import {cellWidth, classNames, headerCol, Table, TableBody, TableHeader, Visibility} from '@patternfly/react-table';
import {CheckCircleIcon, ErrorCircleOIcon, PlusCircleIcon} from '@patternfly/react-icons';
import axios from '@app/utils/api';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {useModalState, useStateTechTalk} from '@app/utils/commonState';

const SCRAPE_URL = process.env.SCRAPE_URL || 'http://localhost:3000/';


const TechTalks: React.FunctionComponent<any> = () => {
  const {
    setTechTalk, handleTextInputChangeLocation, handleTextInputChangeMobNotification, handleTextInputChangeAddInfo,
    handleTextInputChangeDate, handleTextInputChangePresenter, handleTextInputChangeTopic, techTalk
  } = useStateTechTalk();
  const {isModalOpen, setIsModalOpen} = useModalState();

  const [columns] = useState([
    {title: 'Id', columnTransforms: [classNames(Visibility.hidden)]},
    {title: 'Topic', cellTransforms: [headerCol()], transforms: [cellWidth(20)]},
    'Presenter',
    'Location',
    'When',
    {title: 'MobileVal', columnTransforms: [classNames(Visibility.hidden)]},
    'Mobile',
    'Information']);
  const [actions] = useState([
    {
      title: 'Edit',
      onClick: (event, rowId, rowData) => {
        setTechTalk({
          id: rowData.id.title,
          topic: rowData.topic.title,
          presenter: rowData.presenter.title,
          location: rowData.location.title,
          date: moment(rowData.when.title, "MMMM D, YYYY, h:mm a").toDate(),
          addiInfo: rowData.information.title,
          mobileNotify: rowData.mobileval.title
        });
        setIsModalOpen(true);
      },
    },
    {
      isSeparator: true, title: 'Seperator', onClick: (): void => {
      }
    },
    {
      title: 'Delete',
      onClick: (event, rowId, rowData): void => {
        axios.delete('techtalk/' + rowData.id.title).then(() => getTechTalks())
      },
    },
  ]);
  const [rows, setRows] = useState<any[]>([]);

  const handleModalToggle = () => {
    setTechTalk({
      id: '',
      topic: '',
      presenter: '',
      location: '',
      date: '',
      addiInfo: '',
      mobileNotify: false
    });
    setIsModalOpen(!isModalOpen);
  };
  const getTechTalks = () => {
    axios.get('alltechtalks').then((res) => {
      let techTalkRows: any[] = [];
      res.data && res.data.map(data => {
        const cells: any[] = [
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
                {data.mobileNotify ? <CheckCircleIcon key="icon" color="green"/> : <ErrorCircleOIcon key="icon"/>}
              </React.Fragment>
            )
          },
          data.additionalInfo,
        ];
        techTalkRows = [...techTalkRows, cells];
      });
      setRows(techTalkRows);
    });
  };
  const addUpdateTechTalk = () => {
    if (techTalk.topic === '' || techTalk.presenter === '' || techTalk.location === '' || techTalk.date === undefined) {
      return;
    }
    if (techTalk.id !== '') {
      axios.put('updatetechtalk', {
        id: techTalk.id,
        topic: techTalk.topic,
        presenter: techTalk.presenter,
        location: techTalk.location,
        date: techTalk.date,
        additionalInfo: techTalk.addiInfo,
        mobileNotify: techTalk.mobileNotify,
      }).then(() => {
        setIsModalOpen(!isModalOpen);
        getTechTalks();
      });
    } else {
      axios.post('techtalk', {
        topic: techTalk.topic,
        presenter: techTalk.presenter,
        location: techTalk.location,
        date: techTalk.date,
        additionalInfo: techTalk.addiInfo,
        mobileNotify: techTalk.mobileNotify,
      }).then(res => {
        setIsModalOpen(!isModalOpen);
        getTechTalks();
        updateImageTechTalk(res.data.topic, res.data.id);
      });
    }
  };
  const updateImageTechTalk = (keyword, id) => {
    axios.get(SCRAPE_URL.concat('scrape/' + keyword)).then(res => {
      axios.put('updatetechimg', {
        id,
        photoUri: res.data.uri
      }).then(() => console.log('success')).catch(() => console.warn("Couldn't fetch image"));
    })
  };

  useEffect(() => {
    getTechTalks()
  }, []);

  return (
    <React.Fragment>
      <PageSection>
        <TextContent>
          <Text component="h1">Upcoming Tech Talks</Text>
        </TextContent>
        <Button variant="primary" onClick={handleModalToggle}>
          <PlusCircleIcon/> Add Tech Talk
        </Button>
      </PageSection>
      <PageSection>
        <Table aria-label="table" actions={actions} cells={columns} rows={rows}>
          <TableHeader/>
          <TableBody/>
        </Table>
        <Modal
          isLarge
          title={techTalk.id !== '' ? 'Update Tech Talk' : 'Add Tech Talk'}
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
              {techTalk.id !== '' ? 'Update' : 'Submit'}
            </Button>,
          ]}
        >
          <Form isHorizontal>
            <FormGroup
              label="Topic"
              isRequired
              helperTextInvalid="Enter event's topic"
              isValid={techTalk.topic !== ''}
              fieldId="horizontal-form-topic"
            >
              <TextInput
                value={techTalk.topic}
                isRequired
                isValid={techTalk.topic !== ''}
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
              isValid={techTalk.presenter !== ''}
            >
              <TextInput
                value={techTalk.presenter}
                isRequired
                isValid={techTalk.presenter !== ''}
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
              isValid={techTalk.location !== ''}
            >
              <TextInput
                value={techTalk.location}
                onChange={handleTextInputChangeLocation}
                isRequired
                isValid={techTalk.location !== ''}
                type="email"
                id="horizontal-form-email"
                name="horizontal-form-email"
              />
            </FormGroup>
            <FormGroup
              label="Date & Time"
              isRequired
              helperTextInvalid="Enter event's date & time"
              isValid={techTalk.date !== undefined}
              fieldId="horizontal-form-date"
            >
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
                type="text"
                id="horizontal-form-exp"
              />
            </FormGroup>
            <FormGroup fieldId="horizontal-form-checkbox">
              <Checkbox
                label="Send mobile notification"
                id="send-noti-checkbox"
                name="send-noti-checkbox"
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

export {TechTalks};
