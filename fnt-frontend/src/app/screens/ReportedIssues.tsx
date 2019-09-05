import React, {useEffect, useState} from 'react';
import {PageSection, PageSectionVariants, Text, TextContent} from '@patternfly/react-core';
import {cellWidth, classNames, headerCol, Table, TableBody, TableHeader, Visibility,} from '@patternfly/react-table';
import {CheckCircleIcon, ErrorCircleOIcon} from '@patternfly/react-icons';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly.css';
import axios from '@app/utils/api';

const ReportedIssues: React.FunctionComponent<any> = (props) => {
  const [columns] = useState([
    {
      title: 'Id', columnTransforms: [classNames(Visibility.hidden)],
    },
    {
      title: 'Reporter', cellTransforms: [headerCol()], transforms: [cellWidth(20)],
    },
    'Description',
    'Fixed',
  ]);
  const [actions] = useState([
    {
      title: 'Mark as Fixed',
      onClick: (event, rowId, rowData) =>
        axios.put('updatereportedissue/'+rowData.id.title, {
          fixed: true,
        }).then(() => getAllReportedIssues()),
    }
  ]);
  const [rows, setRows] = useState<any[]>([]);
  const getAllReportedIssues = () => {
    axios.get('allreportedissues').then(res => {
      let reportedRows: any[] = [];
      res.data && res.data.map(data => {
        const cells: any[] = [
          data.id,
          data.reporter,
          data.description,
          {
            title: (
              <React.Fragment>
                {data.fixed ? <CheckCircleIcon key="icon" color="green"/> : <ErrorCircleOIcon key="icon"/>}
              </React.Fragment>
            )
          },
        ];
        reportedRows = [...reportedRows, cells]
      });
      setRows(reportedRows)
    });
  };
  useEffect(() => {
    getAllReportedIssues()
  }, []);
  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Reported Issues</Text>
        </TextContent>
      </PageSection>
      <PageSection type='nav' style={{height: '80vh'}} isFilled={true}>
        <Table aria-label="table" actions={actions} cells={columns} rows={rows}>
          <TableHeader/>
          <TableBody/>
        </Table>
      </PageSection>
    </React.Fragment>
  );
};

export {ReportedIssues};
