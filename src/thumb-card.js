import React, { Component } from 'react';
import _ from 'lodash';
import { TextField} from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { FocusZone } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import axios from 'axios';
import './thumb-card.css';

const ROWS_PER_PAGE = 3;
const MAX_ROW_HEIGHT = 250;

export default class ThumbCard extends Component {
  
  constructor(props){
    super(props)
    this.state = {
     items: [
      ]
    }
    this._columnCount=0
    this._columnWidth=0
    this._rowHeight=0
    this._getItemCountForPage = this._getItemCountForPage.bind(this);
    this._getPageHeight = this._getPageHeight.bind(this);
  }

  
  getDetailsByUserId() {
    let id = this.refs.userId.value
    if(!id) {
      this.setState({items:[]})
      return
    }
    this.getUser(id)
  }

  async getUser(id) {
    try {
      const url = 'https://reqres.in/api/users/'+id
      const response = await axios.get(url);
      let items = (response.data && [response.data.data]) || []
      this.setState({items})
    } catch (error) {
      this.setState({items : []})
    }
  }

  _getItemCountForPage(itemIndex, surfaceRect) {
    if (itemIndex === 0) {
      this._columnCount = Math.ceil(surfaceRect.width / MAX_ROW_HEIGHT);
      this._columnWidth = Math.floor(surfaceRect.width / this._columnCount);
      this._rowHeight = this._columnWidth;
    }

    return this._columnCount * ROWS_PER_PAGE;
  }

  _getPageHeight(itemIndex, surfaceRect) {
    return this._rowHeight * ROWS_PER_PAGE;
  }

  _onRenderCell(item, index=undefined) {
    return (
      <div
        className='ms-ListGridExample-tile'
        data-is-focusable={ true }
        style={ {
          width: (100 / this._columnCount) + '%'
        } }
      >
       <div className='ms-ListGridExample-sizer'>
          <div className='msListGridExample-padder'>
            <img src={ item.avatar } className='ms-ListGridExample-image' />
            <div className="ms-bottom-span">
              <span className='col-md-4 ms-ListGridExample-label'>
                { `ID: ${item.id}` }
              </span>
              <span className='col-md-8 ms-ListGridExample-label'>
                { `Name: ${item.first_name}` }
              </span>
            </div>
           
          </div>
        </div> 
      </div>
    );
  }
    
    render(){
        return (
           <div className="container">
                <div className="table-margin">
                  <div className="row row-margin">
                    <TextField
                      placeholder='Enter UserId'
                      ariaLabel='Please enter user id'
                      ref='userId'
                      />
                      <DefaultButton
                        primary={ false }
                        data-automation-id='getDetails'
                        disabled={ false }
                        checked={ true }
                        text='Get Details'
                        onClick={()=>this.getDetailsByUserId()}
                    />
                    </div>
                  </div>
                  <div className="row table-margin">
                  <FocusZone>
                    <List
                      className='ms-ListGridExample'
                      items={ this.state.items }
                      getItemCountForPage={ this._getItemCountForPage }
                      getPageHeight={ this._getPageHeight }
                      renderedWindowsAhead={ 4 }
                      onRenderCell={ this._onRenderCell.bind(this) }
                    />
                  </FocusZone>
                  {_.isEmpty(this.state.items) && (<div>Not Available</div>)}
                  </div>
            </div>
        )
    }
}
