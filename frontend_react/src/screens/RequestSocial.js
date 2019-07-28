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
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

class RequestSocial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      columns: [
        {
          title: 'Id',
          columnTransforms: [classNames(Visibility.hidden)],
        },
        {
          title: 'Place',
          cellTransforms: [headerCol()],
          transforms: [cellWidth(20)],
        },
        'Location',
        'Votes',
        'Promoted',
        'Additional Information',
      ],
      rows: [],
      actions: [
        {
          title: 'Promote to Upcoming',
          onClick: (event, rowId, rowData, extra) => {
            this.setState({
              id: rowData.id.title,
              place: rowData.place.title,
              location: rowData.location.title,
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
          title: 'Delete',
          onClick: (event, rowId, rowData, extra) =>
            axios.delete('requestedsocial/' + rowData.id.title).then(res => this.getAllRequestedSocialEvents()),
        },
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
    this.getAllRequestedSocialEvents();
  }

  getAllRequestedSocialEvents = () => {
    axios.get('allrequestedsocial').then(res => {
      var rows = [];
      res.data && res.data.map(data => {
        var modrows = [
          data.id,
          data.place,
          data.location,
          data.votes !== [] ? data.votes.length : 0,
          {
            title: (
              <React.Fragment>
                {data.promoted ? <CheckCircleIcon key="icon" color="green"/> : <ErrorCircleOIcon key="icon"/> }
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

  promoteSocialEvent = () => {
    const { id, place, location, date, addiInfo, mobNoti } = this.state;
    axios.post('socialevent', {
      place,
      location,
      date,
      additionalInfo: addiInfo,
      mobileNotify: mobNoti,
    }).then(res => {
      axios.put('promotesocialrequest',{
          id,
          promoted: true,
      }).then(res => {
        this.setState(({ isModalOpen }) => ({
        isModalOpen: !isModalOpen,
        }))
        this.getAllRequestedSocialEvents();
      })
    })
  };

  render() {
    const { columns, rows, actions, isModalOpen, place, location, date, addiInfo, mobNoti } = this.state;
    return (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">Requested Social Events</Text>
          </TextContent>
        </PageSection>
        <PageSection type="nav" style={{height: '80vh'}} isFilled={true}>
          <Table actions={actions} cells={columns} rows={rows}>
            <TableHeader />
            <TableBody />
          </Table>
          <Modal
            isLarge
            title='Promote to Upcoming Social Event'
            isOpen={isModalOpen}
            onClose={this.handleModalToggle}
            actions={[
              <Button
                key="cancel"
                variant="secondary"
                onClick={this.handleModalToggle}
              >
              Cancel</Button>,
              <Button
                key="confirm"
                variant="primary"
                onClick={this.promoteSocialEvent}
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
                <DatePicker
                  selected={date}
                  onChange={this.handleTextInputChangeDate}
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

export default RequestSocial;
