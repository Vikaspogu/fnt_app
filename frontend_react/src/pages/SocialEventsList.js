import React from "react";
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
  Checkbox
} from "@patternfly/react-core";
import {
  Table,
  TableHeader,
  TableBody,
  headerCol
} from "@patternfly/react-table";
import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/patternfly.css";

class SocialEventsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      page: 1,
      place: "",
      location: "",
      date: "",
      time: "",
      addiInfo: "",
      mobNoti: false,
      columns: [
        { title: "Place", cellTransforms: [headerCol()] },
        "Location",
        "Date",
        "Time",
        "Additional Information"
      ],
      rows: [
        {
          cells: ["one", "two", "a", "four", "five"]
        },
        {
          cells: ["two", "two", "k", "four", "five"]
        },
        {
          cells: ["three", "two", "b", "four", "five"]
        },
        {
          cells: ["four", "two", "a", "four", "five"]
        },
        {
          cells: ["five", "two", "k", "four", "five"]
        }
      ],
      actions: [
        {
          title: 'Delete',
          onClick: (event, rowId, rowData, extra) =>
            console.log("clicked on Delete action, on row: ", rowId)
        }
      ]
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
    this.handleTextInputChangeTime = time => {
      this.setState({ time });
    };
    this.handleTextInputChangeAddInfo = addiInfo => {
      this.setState({ addiInfo });
    };
    this.handleTextInputChangeMobNotification = mobNoti => {
      this.setState({ mobNoti });
    };
    this.handleModalToggle = () => {
      this.setState(({ isModalOpen }) => ({
        isModalOpen: !isModalOpen
      }));
    };
    this.onSetPage = (_event, pageNumber) => {
      this.setState({
        page: pageNumber
      });
    };
    this.onPerPageSelect = (_event, perPage) => {
      this.setState({
        perPage
      });
    };
  }

  render() {
    const {
      columns,
      rows,
      actions,
      isModalOpen,
      place,
      location,
      date,
      time,
      addiInfo,
      mobNoti
    } = this.state;
    return (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">Upcoming Social Events</Text>
          </TextContent>
          <Button variant="primary" onClick={this.handleModalToggle}>
            Add Social Event
          </Button>
        </PageSection>
        <PageSection>
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
            title="Add Social Event"
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
                onClick={this.handleModalToggle}
              >
                Confirm
              </Button>
            ]}
          >
            <Form isHorizontal>
              <FormGroup
                label="Place"
                isRequired
                fieldId="horizontal-form-name"
              >
                <TextInput
                  value={place}
                  isRequired
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
              <FormGroup label="Date" isRequired fieldId="horizontal-form-date">
                <TextInput
                  value={date}
                  onChange={this.handleTextInputChangeDate}
                  isRequired
                  type="date"
                  id="horizontal-form-date"
                  name="horizontal-form-date"
                />
              </FormGroup>
              <FormGroup label="Time" isRequired fieldId="horizontal-form-time">
                <TextInput
                  value={time}
                  onChange={this.handleTextInputChangeTime}
                  isRequired
                  type="time"
                  id="horizontal-form-time"
                  name="horizontal-form-time"
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
              <FormGroup>
                <Checkbox
                  label="Send mobile notification"
                  id="alt-form-checkbox-1"
                  name="alt-form-checkbox-1"
                  isChecked={mobNoti}
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

export default SocialEventsList;
