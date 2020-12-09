// @flow

import React, { Component } from "react";

import "../style/Form.css";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';

import type { T_LTWH } from "../types.js";

interface PropertyFormFields {
  error: boolean,
  errorMessage: string,
  type: string,
  resourceName: string,
  property: {
    label: string,
    description: string
  },
  propertyType: string
}

type Props = {
  position: {           //position of the highlighted text in the PDF
    boundingRect: T_LTWH,
    rects: Array<T_LTWH>
  },
  onConfirm: (form: PropertyFormFields) => void,  // function takes in the property form fields and 
                                                  // creates the property annotation on the PDF highlighter component
  content: {
    text: string        //the highlighted text
  },
  resources: string[],  //the list of all resource names created per project 
  isScrolledTo: boolean
};

class PropertyForm extends Component<Props> {

  constructor(props){
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changeInstantiation = this.changeInstantiation.bind(this); 
    this.state = {
      error: false,
      errorMessage: "",
      type: "Property",
      resourceName: "",
      property: {
        label: "",
        description: ""
      },
      propertyType: ''
    }
  }

  /* indicates the resource name in which the user is associating with the given highlight (autocomplete field)*/
  changeInstantiation(inputValue){
    this.setState({
      resourceName: inputValue
    })
    
  }

  /*
    updates the label or definition property of the resource (definition is indicated as description)
    assumes that there are only 2 properties per resource 
  */
  handleChange(event){
    const propertyVal = event.target.value;
    if(propertyVal === "label"){
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
      onConfirm,
      resources,
      highlights
    } = this.props;


    return (
      <form
      className="form"
      onSubmit={event => {
        /*
          Adds validation prior to property being added to the current user's annotations
          if the specified property has already been created, an error will be returned to the user
        */
        event.preventDefault();
        const unusedProperty = highlights.filter((h) => {return h.resource.resourceName === this.state.resourceName && h.resource.property.label === this.state.propertyType})
        if(unusedProperty.length > 0){
          this.setState({
            error: true,
            errorMessage: "Property is already defined for the specified resource"
          })
        }else {
          this.setState({
            error: false,
            errorMessage: ""
          })
          onConfirm(this.state);
        }
      }}
    >
          <h3>Create Property</h3>
          <div className = "field">
            <Autocomplete
            inputValue={this.state.resourceName} 
            onInputChange={(_, newInputValue) => {
              this.changeInstantiation(newInputValue)}}
            id="Resource"
            options={resources}
            getOptionLabel={(option) => option}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Resource Instantiation" variant="outlined" required={true}/>}
            />
          </div>
          <div className = "field">
            <InputLabel id="property-select-label">Property</InputLabel>
            <FormControl className="formControl">
            <Select
              error={this.state.error}
              labelId="property-select-label"
              id="propety-select"
              value={this.state.propertyType}
              onChange={this.handleChange}
              style={{ width: 300 }}
              required={true}
            >
              <MenuItem value={"label"}>rdfs:label</MenuItem>
              <MenuItem value={"description"}>skos:description</MenuItem>
            </Select>
            <FormHelperText error={this.state.error}>{this.state.errorMessage}</FormHelperText>
          </FormControl>
          <div class="field">
              <Button
                  type="submit"
                  className="create-property"
                  variant="contained"
                  color="primary"
              >
                  Create Property
              </Button>
            </div>
          </div>
        </form>
    );
  }
}

export default PropertyForm;
