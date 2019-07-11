import React from 'react';
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  Pagination,
  PaginationVariant,
} from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  headerCol,
  cellWidth,
} from '@patternfly/react-table';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly.css';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080/";
class RequestTechTalk extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'Place',
          cellTransforms: [headerCol()],
          transforms: [cellWidth(10)],
        },
        'Location',
        'Votes',
        'Additional Information',
      ],
      rows: [],
      actions: [
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
  }

  componentDidMount() {
    this.getAllRequestedTechTalks();
  }

  getAllRequestedTechTalks = () => {
    axios.get(BACKEND_URL.concat('allrequestedtech'))
      .then(res => {
        var rows = [];
        res.data.map(data => {
          var modrows = [
            data.place,
            data.location,
            data.votes.length,
            data.additionalInfo,
          ];
          rows.push(modrows);
        });
        this.setState({ rows: rows });
      });
  };
  render() {
    const { columns, rows, actions } = this.state;
    return (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">Requested Tech Talks</Text>
          </TextContent>
        </PageSection>
        <PageSection type='nav' isFilled={true}>
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
        </PageSection>
      </React.Fragment>
    );
  }
}

export default RequestTechTalk;
