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
import { PlusCircleIcon, CheckCircleIcon, ErrorCircleOIcon } from '@patternfly/react-icons';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly.css';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const SCRAPE_URL = process.env.SCRAPE_URL || 'http://localhost:3000/';

class SocialEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      id: '',
      place: '',
      location: '',
      date: '',
      addiInfo: '',
      mobNoti: false,
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
        'When',
        {
          title: 'MobileVal',
          columnTransforms: [classNames(Visibility.hidden)],
        },
        'Mobile',
        'Information',
      ],
      rows: [],
      actions: [
        {
          title: 'Edit',
          onClick: (event, rowId, rowData, extra) => {
            this.setState({
              id: rowData.id.title,
              place: rowData.place.title,
              location: rowData.location.title,
              date: moment(rowData.when.title, "MMMM D, YYYY, h:mm a").toDate(),
              addiInfo: rowData.information.title,
              mobNoti: rowData.mobileval.title,
              isModalOpen: true,
            });
          },
        },
        {
          isSeparator: true,
        },
        {
          title: 'Delete',
          onClick: (event, rowId, rowData, extra) => {
            axios.delete('socialevent/' + rowData.id.title).then(res => this.getAllSocialEvents());
          },
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
        id: '',
        place: '',
        location: '',
        date: '',
        addiInfo: '',
        mobNoti: false,
      }));
    };
  }

  componentDidMount() {
    this.getAllSocialEvents();
  }

  getAllSocialEvents = () => {
    axios.get('allsocialevents').then(res => {
      var rows = [];
      res.data && res.data.map(data => {
        var modrows = [
          data.id,
          data.place,
          data.location,
          moment(data.date, 'YYYY-MM-DDThh:mm').format("MMMM D, YYYY, h:mm a"),
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
        rows.push(modrows);
      });
      this.setState({ rows: rows });
    });
  };

  updateImageSocial = (keyword, id) => {
    axios.get(SCRAPE_URL.concat('scrape/'+keyword)).then(res => {
      axios.put('updatesocialimg', {
          id,
          photoUri: res.data
      })
    })
  }

  addUpdateSocialEvent = () => {
    const { id, place, location, date, addiInfo, mobNoti } = this.state;
    if (place === '' || location === '' || date === '') {
      return
    }
    if (id !== '') {
      axios.put('updatesocialevent', {
          id,
          place,
          location,
          date,
          additionalInfo: addiInfo,
          mobileNotify: mobNoti,
        }).then(res => {
          this.setState(({ isModalOpen }) => ({
            isModalOpen: !isModalOpen,
          }));
          this.getAllSocialEvents();
        });
    } else {
      axios.post('socialevent', {
          place,
          location,
          date,
          additionalInfo: addiInfo,
          mobileNotify: mobNoti,
        }).then(res => {
          this.setState(({ isModalOpen }) => ({
            isModalOpen: !isModalOpen,
          }));
          this.getAllSocialEvents();
          this.updateImageSocial(res.data.place, res.data.id);
        });
    }
  };

  render() {
    const {
      columns,
      rows,
      actions,
      isModalOpen,
      id,
      place,
      location,
      date,
      addiInfo,
      mobNoti,
    } = this.state;
    return (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">Upcoming Social Events</Text>
          </TextContent>
          <Button variant="primary" onClick={this.handleModalToggle}>
            <PlusCircleIcon /> Add Social Event
          </Button>
        </PageSection>
        <PageSection type="nav" style={{height: '75vh'}} isFilled={true}>
          <Table actions={actions} cells={columns} rows={rows}>
            <TableHeader />
            <TableBody />
          </Table>
          <Modal
            isLarge
            title={id !== '' ? 'Update Social Event' : 'Add Social Event'}
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
              <FormGroup 
                label="Date" 
                isRequired        
                fieldId="horizontal-form-date"
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

export default SocialEvents;
