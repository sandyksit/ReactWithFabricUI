import React, { Component } from 'react';
import ReactTable from "react-table";
import './dynamic-table.css';
import 'react-table/react-table.css'

export default class DynamicTable extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

    
    render(){
     const { data } = this.props
        return (
           <div className="container">
            <div className="table-margin">
            <ReactTable
                data={data}
                columns={[
                        {
                          Header: "Country",
                          accessor: "country"
                        },
                        {
                          Header: "State",
                          accessor: "state"
                        },
                        {
                          Header: "City",
                          accessor: "city"
                        },
                        {
                          Header: "Areas",
                          accessor: "areas"
                        }
                  ]}
                showPagination = {true}
                minRows={5}
              />
              </div>
           </div>
        )
    }
}
