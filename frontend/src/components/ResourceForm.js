// @flow

import React, { Component } from "react";

import "./style/Form.css";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

import type { T_LTWH } from "../types.js";

type Props = {
  position: {
    boundingRect: T_LTWH,
    rects: Array<T_LTWH>
  },
  onClick?: () => void,
  onMouseOver?: () => void,
  onMouseOut?: () => void,
  content: {
    text: string
  },
  isScrolledTo: boolean
};

class ResourceForm extends Component<Props> {

  constructor(props){
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changeResourceName = this.changeResourceName.bind(this);
    this.changeType = this.changeType.bind(this); 
    this.state = {
      type: "",
      resourceName: "",
      property: {
        label: "",
        description: ""
      },
      propertyType: ''
    }
  }

  changeResourceName(event){
    this.setState({
      resourceName: event.target.value
    })
  }

  changeType(inputValue){
    this.setState({
      type: inputValue
    }, () => {
      console.log(this.state.type);
    })
    
  }

  handleChange(event){
    const propertyVal = event.target.value;
    if(propertyVal == "label"){
      this.setState({
        propertyType: propertyVal,
        property: {
          label: this.props.content.text,
          description: this.state.property.description
        }
      });
    } else {
      this.setState({
        propertyType: propertyVal,
        property: {
          label: this.state.property.label,
          description: this.props.content.text,
        }
      });  
    }
  };

  render() {
    const {
      onClick,
      onMouseOver,
      onMouseOut,
      onConfirm,
      resources,
    } = this.props;


    return (
      <form
      className="resource-form"
      onSubmit={event => {
        event.preventDefault();
        onConfirm(this.state);
      }}
    >
          <h3>Create Resource</h3>
          <div className = "field">
            <Autocomplete
            inputValue={this.state.type} 
            onInputChange={(_, newInputValue) => {
              this.changeType(newInputValue)}}
            id="Resource"
            options={resources}
            getOptionLabel={(option) => option.resourcetype}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Resource Type" variant="outlined" />}
            />
          </div>
          <div className = "field">
            <TextField value={this.state.resourceName} onChange={this.changeResourceName} label="Resource ID"  style={{ width: 300 }} variant="outlined" />
          </div>
          <div className = "field">
            <InputLabel id="property-select-label">Property</InputLabel>
            <FormControl className="formControl">
            <Select
              labelId="property-select-label"
              id="propety-select"
              value={this.state.propertyType}
              onChange={this.handleChange}
              style={{ width: 300 }}
            >
              <MenuItem value={"label"}>skos:label</MenuItem>
              <MenuItem value={"description"}>skos:description</MenuItem>
            </Select>
          </FormControl>
          <div class="field">
              <Button
                  type="submit"
                  className="create-resource"
                  variant="contained"
                  color="primary"
              >
                  Create Resource
              </Button>
            </div>
          </div>
        </form>
    );
  }
}

export default ResourceForm;
