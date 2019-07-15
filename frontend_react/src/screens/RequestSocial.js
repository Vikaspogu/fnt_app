import React from 'react';
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
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
class RequestSocial extends React.Component {
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
    this.getAllRequestedSocialEvents();
  }

  getAllRequestedSocialEvents = () => {
    axios.get(BACKEND_URL.concat('allrequestedsocial'))
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
            <Text component="h1">Requested Social Events</Text>
          </TextContent>
        </PageSection>
        <PageSection type='nav' isFilled={true}>
          <Table actions={actions} cells={columns} rows={rows}>
            <TableHeader />
            <TableBody />
          </Table>
        </PageSection>
      </React.Fragment>
    );
  }
}

export default RequestSocial;
