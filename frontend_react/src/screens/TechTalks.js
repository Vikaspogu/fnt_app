import React from 'react';
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
  classNames,
  Visibility,
} from '@patternfly/react-table';
import { PlusCircleIcon, CheckCircleIcon, ErrorCircleOIcon } from '@patternfly/react-icons';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly.css';
import axios from 'axios';
import moment from 'moment';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080/';
const SCRAPE_URL = process.env.SCRAPE_URL || 'http://localhost:3000/';

class TechTalks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      id: '',
      topic: '',
      presenter: '',
      location: '',
      date: '',
      addiInfo: '',
      mobNoti: false,
      columns: [
        {
          title: 'Id',
          columnTransforms: [classNames(Visibility.hidden)],
        },
        { title: 'Topic', cellTransforms: [headerCol()] },
        'Presenter',
        'Location',
        'Date & Time',
        'Mobile',
        'Additional Information',
      ],
      rows: [],
      actions: [
        {
          title: 'Edit',
          onClick: (event, rowId, rowData, extra) => {
            this.setState({
              id: rowData.id.title,
              topic: rowData.topic.title,
              presenter: rowData.presenter.title,
              location: rowData.location.title,
              date: moment(rowData[4], 'MMMM D, YYYY, h:mm a').format(
                'YYYY-MM-DDThh:mm'
              ),
              addiInfo: rowData[5],
              mobNoti: rowData[6],
              isModalOpen: true,
            });
          },
        },
        {
          isSeparator: true,
        },
        {
          title: 'Delete',
          onClick: (event, rowId, rowData, extra) =>
            axios.delete(BACKEND_URL.concat('techtalk/' + rowData.id.title))
              .then(res => {
                this.getAllTechTalks();
              }),
        },
      ],
    };
    this.onChange = (value, event) => {
      this.setState({ value });
    };
    this.handleTextInputChangeTopic = topic => {
      this.setState({ topic });
    };
    this.handleTextInputChangePresenter = presenter => {
      this.setState({ presenter });
    };
    this.handleTextInputChangeLocation = location => {
      this.setState({ location });
    };
    this.handleTextInputChangeDate = date => {
      this.setState({ date });
    };
    this.handleTextInputChangeAddInfo = addiInfo => {
      this.setState({ addiInfo });
    };
    this.handleTextInputChangeMobNotification = mobNoti => {
      this.setState({ mobNoti });
    };
    this.handleModalToggle = () => {
      this.setState(({ isModalOpen }) => ({
        isModalOpen: !isModalOpen,
        topic: '',
        presenter: '',
        location: '',
        date: '',
        addiInfo: '',
        mobNoti: false,
      }));
    };
  }

  componentDidMount() {
    this.getAllTechTalks();
  }

  getAllTechTalks = () => {
    axios.get(BACKEND_URL.concat('alltechtalks')).then(res => {
      var rows = [];
      res.data && res.data.map(data => {
        var modrows = [
          data.id,
          data.topic,
          data.presenter,
          data.location,
          moment(data.date, 'YYYY-MM-DDThh:mm').format(
            'MMMM D, YYYY, h:mm a'
          ),
          {
            title: (
              <React.Fragment>
                {data.mobileNotify ? <CheckCircleIcon key="icon" /> : <ErrorCircleOIcon key="icon"/> }
              </React.Fragment>
            )
          },
          data.additionalInfo,
        ];
        rows.push(modrows);
      });
      this.setState({ rows: rows });
    });
  };

  updateImageTechTalk = (keyword, id) => {
    console.log(keyword+id);
    axios.get(SCRAPE_URL.concat('scrape/'+keyword)).then(res => {
      axios.put(BACKEND_URL.concat('updatetechimg'), {
          id,
          photoUri: res.data
      })
    })
  }

  addUpdateTechTalk = () => {
    const {
      id,
      topic,
      presenter,
      location,
      date,
      addiInfo,
      mobNoti,
    } = this.state;
    if (topic === '' || presenter === '' || location === '' || date === '') {
      return;
    }
    if (id !== '') {
      axios.post(BACKEND_URL.concat('updatetechtalk'), {
          id,
          topic,
          presenter,
          location,
          date,
          additionalInfo: addiInfo,
          mobileNotify: mobNoti,
        }).then(res => {
          this.setState(({ isModalOpen }) => ({
            isModalOpen: !isModalOpen,
          }));
          this.getAllTechTalks();
        });
    } else {
      axios.post(BACKEND_URL.concat('techtalk'), {
          topic,
          presenter,
          location,
          date,
          additionalInfo: addiInfo,
          mobileNotify: mobNoti,
        }).then(res => {
          this.setState(({ isModalOpen }) => ({
            isModalOpen: !isModalOpen,
          }));
          this.getAllTechTalks();
          this.updateImageTechTalk(res.data.topic, res.data.id);
        });
    }
  };

  render() {
    const {
      id,
      columns,
      rows,
      actions,
      isModalOpen,
      topic,
      presenter,
      location,
      date,
      addiInfo,
      mobNoti,
    } = this.state;
    return (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">Upcoming Tech Talks</Text>
          </TextContent>
          <Button variant="primary" onClick={this.handleModalToggle}>
            <PlusCircleIcon /> Add Tech Talk
          </Button>
        </PageSection>
        <PageSection variant={PageSectionVariants.light} style={{height: '75vh'}} isFilled={true}>
          <Table actions={actions} cells={columns} rows={rows}>
            <TableHeader />
            <TableBody />
          </Table>
          <Modal
            isLarge
            title={id !== '' ? 'Update Tech Talk' : 'Add Tech Talk'}
            isOpen={isModalOpen}
            onClose={this.handleModalToggle}
            actions={[
              <Button
                key="cancel"
                variant="secondary"
                onClick={this.handleModalToggle}
              >
                Cancel
              </Button>,
              <Button
                key="confirm"
                variant="primary"
                onClick={this.addUpdateTechTalk}
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
                  onChange={this.handleTextInputChangeTopic}
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
                  onChange={this.handleTextInputChangePresenter}
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
                  onChange={this.handleTextInputChangeLocation}
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
                isValid={date !== ''}
                fieldId="horizontal-form-date"
              >
                <TextInput
                  value={date}
                  onChange={this.handleTextInputChangeDate}
                  isRequired
                  isValid={date !== ''}
                  type="datetime-local"
                  id="horizontal-form-date"
                  name="horizontal-form-date"
                  min={moment().format('YYYY-MM-DDThh:mm')}
                />
              </FormGroup>
              <FormGroup
                label="Additional Information"
                fieldId="horizontal-form-exp"
              >
                <TextArea
                  value={addiInfo}
                  onChange={this.handleTextInputChangeAddInfo}
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
                  isChecked={mobNoti}
                  aria-label="send-noti-checkbox"
                  onChange={this.handleTextInputChangeMobNotification}
                />
              </FormGroup>
            </Form>
          </Modal>
        </PageSection>
      </React.Fragment>
    );
  }
}

export default TechTalks;
