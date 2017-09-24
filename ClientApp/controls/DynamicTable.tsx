import * as React from 'react';
import { TableDefinition, Field } from '../Models';

export class DynamicTable extends React.Component<TableDefinition, {}>{
  render() {
    return (

      <table className={"dynamic " + (this.props.tableClassName || "table table-striped table-condensed table-bordered")}>
        <thead>
          <tr>
            {
              this.props.columns.map((column,index) => <th key={index} className={column.class}>{column.caption}</th>)
            }
          </tr>
        </thead>
        <tbody>
          {
            this.props.data.map((row,rowIndex) => {
              return (
                <tr key={rowIndex}>
                  {
                    this.props.columns.map((column,columnIndex) => <td key={columnIndex} className={column.class}>{row[column.mapping_field]}</td>)
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }
}