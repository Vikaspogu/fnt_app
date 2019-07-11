import React from 'react';
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  Button,
  Pagination,
  PaginationVariant,
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
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly.css';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080/';

class TechEventsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      page: 1,
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
          columnTransforms: [classNames(Visibility.hidden)]
        },
        { title: 'Topic', cellTransforms: [headerCol()] },
        'Presenter',
        'Location',
        'Date & Time',
        'Additional Information',
        {
          title: 'Mobile Notification',
          columnTransforms: [classNames(Visibility.hidden)]
        }
      ],
      rows: [],
      actions: [
        {
          title: 'Edit',
          onClick: (event, rowId, rowData, extra) => {
            console.log('clicked on edit action, on row: ', rowData);
            this.setState({
              id: rowData.id.title,
              topic: rowData.topic.title,
              presenter: rowData.presenter.title,
              location: rowData.location.title,
              date: rowData[4],
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
            axios.delete(BACKEND_URL.concat('techtalk/'+rowData.id.title))
            .then(res => {this.getAllTechTalkItems()})
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
    this.onSetPage = (_event, pageNumber) => {
      this.setState({
        page: pageNumber,
      });
    };
    this.onPerPageSelect = (_event, perPage) => {
      this.setState({
        perPage,
      });
    };
  }

  componentDidMount() {
    this.getAllTechTalkItems();
  }

  getAllTechTalkItems = () => {
    axios.get(BACKEND_URL.concat('alltechtalks')).then(res => {
      var rows = [];
      res.data.map(data => {
        var modrows = [
          data.id,
          data.topic,
          data.presenter,
          data.location,
          data.date,
          data.additionalInfo,
          data.mobileNotify
        ];
        rows.push(modrows);
      });
      this.setState({ rows: rows });
    });
  };

  addUpdateTechTalk = () => {
    const { id, topic, presenter, location, date, addiInfo, mobNoti } = this.state;
    axios.post(BACKEND_URL.concat(id !== '' ? 'updatetechtalk' : 'techtalk'), {
        id,
        topic,
        presenter,
        location,
        date,
        additionalInfo: addiInfo,
        mobileNotify: mobNoti,
      })
      .then(res => {
        this.setState(({ isModalOpen }) => ({
          isModalOpen: !isModalOpen,
        }));
        this.getAllTechTalkItems();
      });
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
        <PageSection variant={PageSectionVariants.light} isFilled={true}>
          <TextContent>
            <Text component="h1">Upcoming Tech Talks</Text>
          </TextContent>
          <Button variant="primary" onClick={this.handleModalToggle}>
            Add Tech Talk
          </Button>
        </PageSection>
        <PageSection variant={PageSectionVariants.default} isFilled={true}>
          <Table actions={actions} cells={columns} rows={rows}>
            <TableHeader />
            <TableBody />
          </Table>
          <Pagination
            itemCount={100}
            widgetId="pagination-options-menu-bottom"
            perPage={this.state.perPage}
            page={this.state.page}
            variant={PaginationVariant.bottom}
            onSetPage={this.onSetPage}
            onPerPageSelect={this.onPerPageSelect}
          />
          <Modal
            isLarge
            title={id !== '' ? 'Update Tech Talk' : 'Add Tech Talk' }
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
                {id !== '' ? 'Update' : 'Submit' }
              </Button>,
            ]}
          >
            <Form isHorizontal>
              <FormGroup
                label="Topic"
                isRequired
                fieldId="horizontal-form-topic"
              >
                <TextInput
                  value={topic}
                  isRequired
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
              >
                <TextInput
                  value={presenter}
                  isRequired
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
              >
                <TextInput
                  value={location}
                  onChange={this.handleTextInputChangeLocation}
                  isRequired
                  type="email"
                  id="horizontal-form-email"
                  name="horizontal-form-email"
                />
              </FormGroup>
              <FormGroup
                label="Date & Time"
                isRequired
                fieldId="horizontal-form-date"
              >
                <TextInput
                  value={date}
                  onChange={this.handleTextInputChangeDate}
                  isRequired
                  type="datetime-local"
                  id="horizontal-form-date"
                  name="horizontal-form-date"
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

export default TechEventsList;
