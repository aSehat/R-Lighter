// @flow
/* eslint import/no-webpack-loader-syntax: 0 */

import React, { Component } from "react";
import PDFWorker from "worker-loader!pdfjs-dist/lib/pdf.worker";

import {
  PdfLoader,
  PdfHighlighter,
  Highlight,
  Popup,
  AreaHighlight,
  setPdfWorker
} from "react-pdf-highlighter";


import testHighlights from "./test-highlights";


import Tip from "./Tip";
import Spinner from "./Spinner";
import Sidebar from "./Sidebar";

import type {
  T_Highlight,
  T_NewHighlight
} from "react-pdf-highlighter/src/types";

import "./style/App.css";
setPdfWorker(PDFWorker);
const { returnTrimmedProperty } = require('../utils/utils');

type Props = {};

type State = {
  url: string,
  highlights: Array<T_Highlight>,
  classes: {name: {annotationid: string, id: string, name: string, property: {label: string, description: string}, resources: []}},
  resources: { name: {annotationid: string, id: string, property: {label: string, description: string}}},
  properties: { id: {annotationid: string, name: string, resource: string}}
};

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({ highlight }) =>
  highlight ? (
    <div className="Highlight__popup">
      <h4>Resource</h4>
      <p>{highlight.class}:{highlight.resource}</p>
      <h4>Property</h4>
      <p>
        skos:{highlight.property}#{returnTrimmedProperty(highlight.content.text)}
      </p>
    </div>
  ) : null;

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;

class PDFHighlights extends Component<Props, State> {
  state = {
    url: initialUrl,
    highlights: [],
    classes: {
      'Class' :{
        annotationid: null,
        id: null,
        name: 'Class',
        property: null,
        resources: []
      }},
    resources: { 
      
    }
  };

  state: State;

  resetHighlights = () => {
    this.setState({
      highlights: []
    });
  };

  toggleDocument = () => {
    const newUrl =
      this.state.url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

    this.setState({
      url: newUrl,
      highlights: testHighlights[newUrl] ? [...testHighlights[newUrl]] : []
    });
  };

  scrollViewerTo = (highlight: any) => {};

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  componentDidMount() {
    window.addEventListener(
      "hashchange",
      this.scrollToHighlightFromHash,
      false
    );
  }

  getHighlightById(id: string) {
    const { highlights } = this.state;

    return highlights.find(highlight => highlight.id === id);
  }

  createNewClass(highlight, annotationid){
    const newClass = {
      annotationid: annotationid,
      class: highlight.resource.type,
      name: highlight.resource.resourceName,
      property: highlight.resource.property,
      resources: []
    }
    let classes = this.state.classes;
    classes[highlight.resource.resourceName] =  newClass;
    this.setState({
      classes: classes
    }, () => {
      console.log(this.state.classes);
    })
  }

  addNewPropertyToResource(highlight){
    const resources = this.state.resources
    for(let i = 0; i < resources.length; i++){
      if(resources[i].name == highlight.resource.resourceName){
        let newResource = {};
        if (highlight.resource.property.label != ""){
          newResource = {
            property: {
              label: highlight.resource.property.label,
              description: resources[i].property.description
            },
            ...resources[i]
          }
        } else {
          newResource = {
            property: {
              label: resources[i].property.label,
              description: highlight.resource.property.description
            },
            ...resources[i]
          }
        }
        break;
      }
    }
    this.setState({
      resources: resources
    });
  }

  createNewResource(highlight, annotationid){
    const newResource = {
      annotationid: annotationid,
      class: highlight.resource.type,
      name: highlight.resource.resourceName,
      property: highlight.resource.property
    }
    let resources = this.state.resources;
    resources[highlight.resource.resourceName] = newResource

    let classes = this.state.classes;
    classes[highlight.resource.type].resources.push(highlight.resource.resourceName)
    this.setState({
      resources: resources,
      classes: classes
    }, () => {
      console.log(this.state.resources);
    }) 
  }



  addHighlight(highlight: T_NewHighlight) {
    const { highlights } = this.state;
    const {content, position, resource } = highlight;
    console.log("Saving highlight", highlight);
    const id = getNextId();
    let list = ""
    if(highlight.resource.type == "Class"){
      this.createNewClass(highlight, id)
      list = "classes"
    }else if(highlight.resource.type == "Property"){
      this.addNewPropertyToResource(highlight)
      list = "resources"
    } else {
      this.createNewResource(highlight, id)
      list = "resources"
    }

    const property = (highlight.resource.property.label === "") ? "description" : "label"
    this.setState({
      highlights: [{ content, position, resource: resource.resourceName, class: resource.type, property: property, list: list, id: id }, ...highlights],
    });
  }

  updateHighlight(highlightId: string, position: Object, content: Object) {
    console.log("Updating highlight", highlightId, position, content);

    this.setState({
      highlights: this.state.highlights.map(h => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest
            }
          : h;
      })
    });
  }

  render() {
    const { url, highlights } = this.state;
    console.log(this.state.classes);
    
    return (
      <div className="App" style={{ display: "flex", height: "100vh" }}>
        <Sidebar
          highlights={highlights}
          resources={this.state.resources}
          classes={this.state.classes}
          resetHighlights={this.resetHighlights}
          toggleDocument={this.toggleDocument}
        />
        <div
          style={{
            height: "100vh",
            width: "75vw",
            position: "relative"
          }}
        >
          <PdfLoader url={url} beforeLoad={<Spinner />}>
            {pdfDocument => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={event => event.altKey}
                onScrollChange={resetHash}
                // pdfScaleValue="page-width"
                scrollRef={scrollTo => {
                  this.scrollViewerTo = scrollTo;

                  this.scrollToHighlightFromHash();
                }}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection
                ) => (
                  <Tip
                    onOpen={transformSelection}
                    content={content}
                    onConfirm={resource => {
                      console.log(resource);
                      this.addHighlight({ content, position, resource });

                      hideTipAndSelection();
                    }}
                    classes={this.state.classes}
                    resources={this.state.resources}
                  />
                )}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo
                ) => {
                  console.log(highlight);
                  const isTextHighlight = !Boolean(
                    highlight.content && highlight.content.image
                  );

                  const component = isTextHighlight ? (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.list ? this.state[highlight.list][highlight.resource]: null}
                    />
                  ) : (
                    <AreaHighlight
                      highlight={highlight}
                      onChange={boundingRect => {
                        this.updateHighlight(
                          highlight.id,
                          { boundingRect: viewportToScaled(boundingRect) },
                          { image: screenshot(boundingRect) }
                        );
                      }}
                    />
                  );

                  return (
                    <Popup
                      popupContent={<HighlightPopup highlight={highlight} />}
                      onMouseOver={popupContent => {
                        console.log(highlight)
                        setTip(highlight, highlight => popupContent)
                      }}
                      onMouseOut={hideTip}
                      key={index}
                      children={component}
                    />
                  );
                }}
                highlights={highlights}
              />
            )}
          </PdfLoader>
        </div>
      </div>
    );
  }
}

export default PDFHighlights;