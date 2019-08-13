import React from 'react';
import {
    PageSection,
    PageSectionVariants,
    TextContent,
    Text
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

class ReportedIssues extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: 'Id',
                    columnTransforms: [classNames(Visibility.hidden)],
                },
                {
                    title: 'Reporter',
                    cellTransforms: [headerCol()],
                    transforms: [cellWidth(20)],
                },
                'Description',
                'Fixed',
            ],
            rows: [],
            actions: [
                {
                    title: 'Mark as Fixed',
                    onClick: (event, rowId, rowData, extra) =>
                        axios.put('updatefixedissue',{
                            id: rowData.id.title,
                            fixed: true,
                        }).then(res => this.getAllReportedIssues()),
                }
            ],
        };
    }

    componentDidMount() {
        this.getAllReportedIssues();
    }

    getAllReportedIssues = () => {
        axios.get('allreportedissues').then(res => {
            let rows = [];
            res.data && res.data.map(data => {
                let modrows = [
                    data.id,
                    data.reporter,
                    data.description,
                    {
                        title: (
                            <React.Fragment>
                                {data.fixed ? <CheckCircleIcon key="icon" color="green"/> : <ErrorCircleOIcon key="icon"/> }
                            </React.Fragment>
                        )
                    },
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
                        <Text component="h1">Reported Issues</Text>
                    </TextContent>
                </PageSection>
                <PageSection type='nav' style={{height: '80vh'}} isFilled={true}>
                    <Table actions={actions} cells={columns} rows={rows}>
                        <TableHeader />
                        <TableBody />
                    </Table>
                </PageSection>
            </React.Fragment>
        );
    }
}

export default ReportedIssues;
