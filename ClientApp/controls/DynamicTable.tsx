import * as React from 'react';

import * as _ from 'lodash';

import { Field, TableDefinition } from '../Models';

export class DynamicTable extends React.Component<TableDefinition, {}> {
    public render() {
        return (
            <table className={'dynamic ' + (this.props.tableClassName || 'table table-striped table-condensed table-bordered')}>
                <thead>
                    <tr>
                        {this.props.columns.map(this.renderHeader)}
                    </tr>
                </thead>
                <tbody>
                    {this.props.data.map(this.renderRow)}
                </tbody>
            </table>
        );
    }
    private renderHeader = (column: Field, index: number) => (
        <th key={index} className={column.class}>{column.caption}</th>
    )
    private renderRow = (row: any, rowIndex: number) => {
        const renderCell = (column: Field, columnIndex: number) => (
            <td key={columnIndex} className={column.class}>{_.at(row, column.mapping_field)}</td>
        );
        return (
        <tr key={rowIndex}>
            {this.props.columns.map(renderCell)}
        </tr>
        );
    }
}
