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
  cellWidth,
  classNames,
  Visibility,
} from '@patternfly/react-table';
import { CheckCircleIcon, ErrorCircleOIcon } from '@patternfly/react-icons';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly.css';
import axios from 'axios';
import moment from 'moment';

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080/";
class RequestTechTalk extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'Id',
          columnTransforms: [classNames(Visibility.hidden)],
        },
        {
          title: 'Topic',
          cellTransforms: [headerCol()],
          transforms: [cellWidth(10)],
        },
        'Presenter',
        'Votes',
        'Promoted',
        'Additional Information',
      ],
      rows: [],
      actions: [
        {
          title: 'Promote to Upcoming',
          onClick: (event, rowId, rowData, extra) => {
            console.log('clicked on Third action, on row: ', rowData)
            this.setState({
              id: rowData.id.title,
              topic: rowData.topic.title,
              presenter: rowData.presenter.title,
              votes: rowData.votes.title,
              date: '',
              addiInfo: rowData[5],
              isModalOpen: true,
            });
          },
        },
        {
          isSeparator: true,
        },
        {
          title: 'Edit',
          onClick: (event, rowId, rowData, extra) =>
            console.log('clicked on edit action, on row: ', rowId),
        },
        {
          title: 'Delete',
          onClick: (event, rowId, rowData, extra) =>
            console.log('clicked on Delete action, on row: ', rowData.topic),
        }
      ],
    };
    this.onChange = (value, event) => {
      this.setState({ value });
    };
    this.handleTextInputChangePlace = place => {
      this.setState({ place });
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
        place: '',
        location: '',
        date: '',
        addiInfo: '',
        mobNoti: false,
      }));
    };
  }

  componentDidMount() {
    this.getAllRequestedTechTalks();
  }

  getAllRequestedTechTalks = () => {
    axios.get(BACKEND_URL.concat('allrequestedtalk'))
      .then(res => {
        var rows = [];
        res.data.map(data => {
          var modrows = [
            data.id,
            data.topic,
            data.presenter,
            data.votes !== [] ? data.votes.length : 0,
          {
            title: (
              <React.Fragment>
                {data.promoted ? <CheckCircleIcon key="icon" /> : <ErrorCircleOIcon key="icon"/> }
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
  
  render() {
    const { columns, rows, actions, isModalOpen,
      id,
      place,
      location,
      date,
      addiInfo,
      mobNoti } = this.state;
    return (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">Requested Tech Talks</Text>
          </TextContent>
        </PageSection>
        <PageSection type='nav' style={{height: '80vh'}} isFilled={true}>
          <Table actions={actions} cells={columns} rows={rows}>
            <TableHeader />
            <TableBody />
          </Table>
          <Modal
            isLarge
            title='Promote to Upcoming Tech Talks'
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
                onClick={this.addUpdateSocialEvent}
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
                  onChange={this.handleTextInputChangePlace}
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
                  onChange={this.handleTextInputChangeLocation}
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
                  id="horizontal-form-exp"
                />
              </FormGroup>
              <FormGroup fieldId="horizontal-form-checkbox">
                <Checkbox
                  label="Send mobile notification"
                  id="alt-form-checkbox-1"
                  name="alt-form-checkbox-1"
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

export default RequestTechTalk;
