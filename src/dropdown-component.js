import React, { Component } from 'react';
import axios from 'axios';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import DynamicTable from './dynamic-table'
import './dropdown-component.css';

export default class DropdownComponent extends Component {
  constructor(props){
    super(props)
    this.state = {
      selectedItem: undefined,
      selectedAllItems:{},
      selectedItems: [],
      isUpdate: false,
      country: [
        
      ],
      state: [],
      city:[],
      tableData:[],
    }
    this.onChangeSingleSelect = this.onChangeSingleSelect.bind(this);
    this.onChangeMultiSelect = this.onChangeMultiSelect.bind(this);
    this.addDataIntoTable = this.addDataIntoTable.bind(this);

  }

  componentWillMount() {
    const url = '/country.json'
      axios.get(url)
        .then((response) => {
            console.log("results:", response)
            this.setState({country: response.data.country})
        })
 }

 filterJson(label, value) {
    let country = this.state.country
    if(label==='country') {
      let filteredCountry = country.filter((user) => {
        return user.key === value
      })[0]
      let state = filteredCountry.states
      this.setState({state})
    } else if(label==='state') {
      let state = this.state.state
      let filteredState = state.filter((cnty) => {
        return cnty.key === value
      })[0]
      let city = filteredState.cities
      this.setState({city})
    } else if(label === 'city') {
      let city = this.state.city
      let filteredCity = city.filter((cty) => {
          return cty.key === value
      })[0]
      let areas = filteredCity.areas
      this.setState({areas})
    }   
 }
  
  _log(str) {    
      console.log(str);    
  }

  onChangeSingleSelect(label, item) {
    this.filterJson(label, item.key)
    let selectedAllItems = this.state.selectedAllItems
    selectedAllItems[label] = item.text
    this.setState({ selectedItem : item });
    this.setState({ selectedAllItems });
  }

  onChangeMultiSelect(label, item) {
    let selectedAllItems = this.state.selectedAllItems 
    let _selectedAllItems = selectedAllItems[label]
    const updatedSelectedAllItemAsText = _selectedAllItems ? this.copyArray(_selectedAllItems) : [];
    const updatedSelectedItem = this.state.selectedItems ? this.copyArray(this.state.selectedItems) : [];
    if (item.selected) {
      // add the option if it's checked
      updatedSelectedItem.push(item.key)
      updatedSelectedAllItemAsText.push(item.text)
      
    } else {
      // remove the option if it's unchecked
      const currIndex = updatedSelectedItem.indexOf(item.key);
      const currTextIndex = updatedSelectedAllItemAsText.indexOf(item.text);
      if (currIndex > -1) {
        updatedSelectedItem.splice(currIndex, 1);
        updatedSelectedAllItemAsText.splice(currTextIndex, 1);
      }
    }
    console.log("selectedAllItemAsText", updatedSelectedAllItemAsText)
    selectedAllItems[label] = updatedSelectedAllItemAsText
    this.setState({
      selectedItems: updatedSelectedItem
    });
    this.setState({ selectedAllItems});
  }

  copyArray(array) {
    const newArray= [];
    for (let i = 0; i < array.length; i++) {
      newArray[i] = array[i];
    }
    return newArray;
  }

  addDataIntoTable() {
    let selectedAllItems = this.state.selectedAllItems
    let tableData = this.state.tableData
    let item = {
      country:selectedAllItems.country,
      state: selectedAllItems.state,
      city: selectedAllItems.city,
      areas: selectedAllItems.areas && selectedAllItems.areas.join(",")
    }
    tableData.push(item)
    this.setState({tableData})
  }

  clearAllDataFromTable() {
    let tableData = this.state.tableData
    tableData = []
    this.setState({tableData})
  }
  resetAll() {
    let selectedItem = undefined, selectedAllItems={}, selectedItems=[]
    this.setState(
      { selectedItem , selectedItems, selectedAllItems}
    );
    // let DropDownHTMLElements = document.querySelectorAll(".ms-Dropdown");
    // for(let i= 0; i< DropDownHTMLElements.length; ++i) {
    //   var Dropdown = new Fabric['Dropdown'](DropDownHTMLElements[i])
    // }
  }

  renderCellItem(cellInfo) {
    console.log("cellInfo:", cellInfo)
    return (
      <div></div>
    )
  }

  renderCustomDDL(ddlData, label, multiSelect) {
    const { selectedItem, selectedItems } = this.state;
    return(
      <div  className='col'>
          {multiSelect  ?
            <Dropdown
                placeHolder='Select an Option'
                selectedKeys={ selectedItems }
                label={label}
                id={label}
                ariaLabel={label}
                options={this.state[label]}
                onChanged={this.onChangeMultiSelect.bind(this, label)}
                multiSelect
                componentRef={ this._basicDropdown }
              /> :
              <Dropdown
                placeHolder='Select an Option'
                selectedKeys={ (selectedItem ? selectedItem.key : undefined) }
                key={label}
                label={label}
                ref={label}
                id={label}
                ariaLabel={label}
                options={this.state[label]}
                onChanged={this.onChangeSingleSelect.bind(this, label)}
                componentRef={ this._basicDropdown }
              />}
        </div>
    )
  }
    
    render(){
      const { ddlData , tableData } = this.state
        return (
           <div className="container">
            <div className="row">
                {this.renderCustomDDL(ddlData, 'country', false)}
                {this.renderCustomDDL(ddlData, 'state', false)}
                {this.renderCustomDDL(ddlData, 'city', false)}
                {this.renderCustomDDL(ddlData, 'areas', true)}
            </div>
            <div className="row with-margin">
              <span className="button-margin">
                  <DefaultButton
                    primary={ true }
                    data-automation-id='addToTable'
                    disabled={ false }
                    checked={ true }
                    text='Add to Table'
                    onClick={this.addDataIntoTable}
                  /></span>
                  <span className="button-margin">
                 <DefaultButton
                    primary={ true }
                    data-automation-id='clearTable'
                    disabled={ false }
                    checked={ true }
                    text='Clear Table'
                    onClick={()=>this.clearAllDataFromTable()}
                /></span> 
                <span className="button-margin">
                 <DefaultButton
                    primary={ false }
                    data-automation-id='reset'
                    disabled={ false }
                    checked={ true }
                    text='RESET'
                    onClick={()=>this.resetAll()}
                />

                 <DefaultButton
                    primary={ false }
                    data-automation-id='select'
                    disabled={ false }
                    checked={ true }
                    text='SELECT'
                    onClick={ this._alertClicked }
                />
                </span>
            </div>
            <div className="row table-margin">
              <DynamicTable
                data={tableData}
              />
              </div>
           </div>
        )
    }
}
