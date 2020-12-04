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

const getRandomColorFromString = (s) => {
  const formattedLabel = s.replace(/ /g, "")
  let rng = seedrandom(formattedLabel)
  const color = "hsl(" + rng() * 360 + ", 100%, 75%)";
  console.log(color);
  return color;
}

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
    const { rects, boundingRect } = position;

    return (
      <div
        className={`Highlight ${isScrolledTo ? "Highlight--scrolledTo" : ""}`}
      >
        {resource ? (
        <div className="Highlight__parts">
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
