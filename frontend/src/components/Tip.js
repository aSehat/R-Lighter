// @flow

import React, { Component } from "react";
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ResourceForm from './ResourceForm';
import PropertyForm from './PropertyForm';

import "./style/Tip.css";

type State = {
  compact: boolean,
  text: string,
  emoji: string
};

type Props = {
  onConfirm: ({}) => void,
  onOpen: () => void,
  onUpdate?: () => void,
  classes: ([]) => void,
  resources: ([]) => void,
  content: (text: string) => void
};

class Tip extends Component<Props, State> {
  state: State = {
    compact: true,
    type: null,
  };

  // for TipContainer
  componentDidUpdate(nextProps: Props, nextState: State) {
    console.log(this.props);
    const { onUpdate } = this.props;

    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();
    }
  }

  render() {
    const { onConfirm, onOpen, classes, resources, content } = this.props;
    const { compact, type } = this.state;

    const renderForm = () => {
        if(type == "resource"){
            return <ResourceForm onConfirm={onConfirm} content={content} resources={classes}/>
        } else if(type == "property"){
            return <PropertyForm onConfirm={onConfirm} content={content} resources={resources}/>
        } else {
            return <h1>ERROR</h1>
        }
    }
    return (
      <div className="Tip">
        {compact ? (
            <Paper className="Tip__compact">
                <MenuList>
                <MenuItem 
                    onClick={() => {
                        onOpen();
                        this.setState({ compact: false, type: "resource" });
                        }}
                > Create Resource
                </MenuItem>
                <MenuItem
                 onClick={() => {
                    onOpen();
                    this.setState({ compact: false, type: "property" });
                    }}
                >Add Property</MenuItem>
                </MenuList>
            </Paper>
        ) : (
            <div className="Tip__card">
                {renderForm()}
            </div>
        )}
      </div>
    );
  }
}

export default Tip;
