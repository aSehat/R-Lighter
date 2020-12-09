// @flow

import React, { Component } from "react";

import "../style/Highlight.css";
import type { T_LTWH } from "../types.js";
var seedrandom = require('seedrandom');

type Props = {
  position: {
    boundingRect: T_LTWH,
    rects: Array<T_LTWH>
  },
  onClick?: () => void,
  onMouseOver?: () => void,
  onMouseOut?: () => void,
  comment: {
    emoji: string,
    text: string
  },
  isScrolledTo: boolean
};
/*
  generates the different color highlights. The randomized number is seeded based on 
  argument s (which is the resource name and type)
*/
const getRandomColorFromString = (s) => {
  const formattedLabel = s.replace(/ /g, "")
  let rng = seedrandom(formattedLabel)
  const color = "hsl(" + rng() * 360 + ", 100%, 75%)";
  console.log(color);
  return color;
}

//Component used to display the highlights on the PDF viewer.
class Highlight extends Component<Props> {
  render() {
    const {
      position,
      onClick,
      onMouseOver,
      onMouseOut,
      resource,
      isScrolledTo
    } = this.props;
    const { rects } = position;

    return (
      <div
        className={`Highlight ${isScrolledTo ? "Highlight--scrolledTo" : ""}`}
      >
        {resource ? (
        <div className="Highlight__parts">
          {/* By default, the resource highlight is colored via the getRandomColorFromString function 
          (colors based off the inputted seed, of resource name and type) */}
          {rects.map((rect, index) => (
            <div
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              onClick={onClick}
              key={index}
              style={{...rect, background: getRandomColorFromString(resource.resourceName+resource.type)}}
              className={`Highlight__part`}
            />
          ))}
        </div>

        ) :  
        <div className="Highlight__parts">
        {/* If the highlight is snapped to (if the user clicks on the associated annotation in the sidebar), 
            the highlighted text will be noted in red*/}
        {rects.map((rect, index) => (
          <div
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
            key={index}
            style={rect}
            className={`Highlight__part`}
          />
        ))}
      </div>}
      </div>
    );
  }
}

export default Highlight;
