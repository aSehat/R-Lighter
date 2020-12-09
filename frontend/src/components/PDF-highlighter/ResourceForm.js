// @flow

import React, { Component } from "react";

import "../style/Form.css";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

import type { T_LTWH } from "../types.js";

interface ResourceFormFields {
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
  onConfirm: (form: ResourceFormFields) => void,  // function takes in the resource form fields and 
                                                  // creates the resource annotation on the PDF highlighter component
  content: {
    text: string        //the highlighted text
  },
  resources: string[],  //the list of all resource names created per project 
  classes: string[],    //the list of all classes created per project
  isScrolledTo: boolean
};
/*
  the Resource form popup to create a new resource.
  see above for general prop types variables and types
*/
class ResourceForm extends Component<Props> {
  
  constructor(props){
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changeResourceName = this.changeResourceName.bind(this);
    this.changeType = this.changeType.bind(this); 
    this.state = {
      error: false,
      errorMessage: "",
      type: "",
      resourceName: "",
      property: {
        label: "",
        description: ""
      },
      propertyType: ''
    }
  }
  /* updates the resource name that is inputted into the resource form (textfield user inputs) */
  changeResourceName(event){
    this.setState({
      resourceName: event.target.value
    })
  }
  /*updates the rdf:type resource*/
  changeType(inputValue){
    this.setState({
      type: inputValue
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
      classes
    } = this.props;


    return (
      <form
      className="resource-form"
      onSubmit={(event) => {
        /*
          Adds validation prior to resource being added to the current user's annotations
          if the resource has already been created, an error will be returned to the user
        */
        event.preventDefault();
        if (resources.includes(this.state.resourceName) || (this.state.type === "Class" && classes.includes(this.state.resourceName))){
          this.setState({
            error: true,
            errorMessage: "Resource name has already been used!"
          })
        } else {
          this.setState({
            error: false,
            errorMessage: ""
          })
          onConfirm(this.state);
        }
      }}
    >
          <h3>Create Resource</h3>
          <div className = "field">
            <Autocomplete
            inputValue={this.state.type}
            defaultValue="Class" 
            onInputChange={(_, newInputValue) => {
              this.changeType(newInputValue)}}
            id="Resource"
            options={["Class"].concat(resources)}
            getOptionLabel={(option) => option}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Resource Type" variant="outlined" required={true} />}
            />
          </div>
          <div className = "field">
            <TextField value={this.state.resourceName} error={this.state.error} helperText={this.state.errorMessage} onChange={this.changeResourceName} label="Resource ID"  style={{ width: 300 }} variant="outlined" required={true}/>
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
              required={true}
            >
              <MenuItem value={"label"}>rdfs:label</MenuItem>
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
