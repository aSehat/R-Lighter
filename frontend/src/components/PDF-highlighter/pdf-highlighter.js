// @flow
/* eslint import/no-webpack-loader-syntax: 0 */

import React, { Component } from "react";
import PDFWorker from "worker-loader!pdfjs-dist/lib/pdf.worker";
import Button from "@material-ui/core/Button";
import axios from 'axios';
import { saveAs } from 'file-saver';

import SaveBtn from '../layout/SaveBtn';
import ExportAnnotBtn from '../layout/ExportAnnotBtn';
import BibTex from '../layout/BibTex';

import {
  PdfLoader,
  PdfHighlighter,
  Highlight,
  Popup,
  AreaHighlight,
  setPdfWorker
} from "react-pdf-highlighter";


import testHighlights from "../test-highlights";


import Tip from "./Tip";
import Spinner from "./Spinner";
import Sidebar from "./Sidebar";

import type {
  T_Highlight,
  T_NewHighlight
} from "react-pdf-highlighter/src/types";

import "../style/App.css";
setPdfWorker(PDFWorker);
const { returnTrimmedProperty } = require('../../utils/utils');

type Props = {};

type State = {
  url: string,
  highlights: Array<T_Highlight>,
  classes: Array<String>,
  resources: Array<String>,
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
      <p>{highlight.resource.type}:{highlight.resource.resourceName}</p>
      <h4>Property</h4>
      <p>
        skos:{highlight.resource.property.label}#{returnTrimmedProperty(highlight.content.text)}
      </p>
    </div>
  ) : null;

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;

class PDFHighlights extends Component<Props, State> {
  state = {
    projectId: this.props.match.params.id,
    token: localStorage.getItem("token"),
    url: "",
    unsavedHighlights: [],
    deletedHighlights: [],
    highlights: [],
    classes: ["Class"],
    resources: []
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

  save = () => {
    const deletedAnnotations = this.state.deletedHighlights.map((h) => h._id)
    const unsavedHighlights = this.state.unsavedHighlights.map((h) => {
      const { saved, id, ...rest} = h
      return rest;
    })
    console.log(unsavedHighlights);
    let headers = {
      'x-auth-token': this.state.token 
    };
    axios.post('/api/annotation', {project_id: this.state.projectId, annotations: unsavedHighlights, deletedAnnotations: deletedAnnotations}, {headers: headers}).then(res => console.log(res.data));
    this.setState({
      unsavedHighlights: []
    });
  }

  export = () => {
    this.save();
    let headers = {
      'x-auth-token': this.state.token 
    };
    axios.get('/api/serialization/'+ this.state.projectId, {headers: headers}).then(res => {
      var content = res.data.rdf;
      var filename = "exportedResources.ttl";
  
      var blob = new Blob([content], {
      type: "text/plain;charset=utf-8"
      });
  
      saveAs(blob, filename); 
    });
}


  componentDidMount() {
    console.log(this.props.match.params.id);
    window.addEventListener(
      "hashchange",
      this.scrollToHighlightFromHash,
      false
    );
    let headers = {
      'x-auth-token': this.state.token 
    };
    axios.get('/api/project/' + this.state.projectId, {headers: headers}).then(res => {
    const savedAnnotations = res.data.project.annotations.map(annotation => {
      return {...annotation, id: annotation._id, saved: true}
    })
    this.setState({
        prefix: res.data.project.prefix,
        url: "/api/pdf?url=" + res.data.project.link,
        highlights: savedAnnotations,
        resources: res.data.resources,
        classes: ["Class",...res.data.classes] 
      })
    });

  }

  getHighlightById(id: string) {
    const { highlights } = this.state;

    return highlights.find(highlight => highlight.id === id);
  }

  createNewResource(highlight){
    const {classes, resources} = this.state;
    if(highlight.resource.type === "Class"){
      this.setState({
        classes: [...classes, highlight.resource.resourceName]
      }, () => {
        console.log(this.state.classes);
      }) 
    } else { // it's a resource instantiation
      this.setState({
        resources: [...resources, highlight.resource.resourceName]
      })
    }
  }

  async getAllDeleteAnnotations(highlight, highlights){ //returns all REMAINING HIGHLIGHTS
    if(highlight.resource.type === "Property" || highlight.resource.type === ""){
      return Promise.resolve(
        {
          remainingHighlights: highlights.filter((h) => h.id != highlight.id),
          deletedHighlights: highlight.saved ? [highlight] : []
        }
      ); 
    }
    var remainingHighlights = [];
    var childrenHighlights = [];
    var deletedHighlights = [];
    highlights.forEach((h) => {
      if (h.id !== highlight.id && (h.resource.type === highlight.resource.resourceName || h.resource.resourceName === highlight.resource.resourceName)){
        childrenHighlights.push(h);
      } else if (h.id !== highlight.id){
        remainingHighlights.push(h);
      }
    })
    for(let i = 0; i < childrenHighlights.length; i++){
      let result = await this.getAllDeleteAnnotations(childrenHighlights[i], remainingHighlights);
      remainingHighlights = result.remainingHighlights;
      deletedHighlights = deletedHighlights.concat(result.deletedHighlights);
    }
    deletedHighlights = highlight.saved ? [highlight, ...deletedHighlights] : [...deletedHighlights]
    return Promise.resolve({remainingHighlights, deletedHighlights});  
  }

  async deleteResource(highlight){
    const {remainingHighlights, deletedHighlights}= await this.getAllDeleteAnnotations(highlight, this.state.highlights);
    this.setState({
      highlights: remainingHighlights,
      deletedHighlights: [...this.state.deletedHighlights, ...deletedHighlights]
    })
  }

  async editResource(highlight){
    alert("here!");
  }

  addHighlight(highlight: T_NewHighlight) {
    const { highlights, unsavedHighlights } = this.state;
    const {content, position, resource } = highlight;
    console.log("Saving highlight", highlight);
    const id = getNextId();
    let list = ""
    if(highlight.resource.type === "Class" || highlight.resource.type !== "Property"){
      this.createNewResource(highlight)
    }
    const property = resource.propertyType
    const newAnnotation = {content, position, resource: {resourceName: resource.resourceName, type: resource.type, property: {label: property}}, id: id, saved: false };
    this.setState({
      unsavedHighlights:[...unsavedHighlights, newAnnotation], 
      highlights: [...highlights, newAnnotation],
    }, () => {
      console.log(this.state.highlights);
    });
    console.log(this.state.highlights);
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
          deleteResource={(highlight) => this.deleteResource(highlight)}
        />
        <div
          style={{
            height: "100vh",
            width: "75vw",
            position: "relative"
          }}
        >
          <Button onClick={() => this.save()} variant="contained" color="primary" style={{height: "40px", position: "relative", display: "inline", textAlign: "center"}}>Save</Button>
          <Button onClick={() => this.export()} variant="contained" color="primary" style={{height: "40px", position: "relative", display: "inline", textAlign: "center"}}>Export Annotations</Button>
          <div>
            <SaveBtn />
            <br/>
            <ExportAnnotBtn />
            <br/>
            <BibTex />
          </div>
          <PdfLoader url={this.state.url} beforeLoad={<Spinner />}>
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
                      this.addHighlight({ content, position, resource });
                      hideTipAndSelection();
                    }}
                    classes={this.state.classes}
                    resources={this.state.resources}
                    highlights={this.state.highlights}
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
                  const isTextHighlight = !Boolean(
                    highlight.content && highlight.content.image
                  );

                  const component = isTextHighlight ? (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight ? highlight.resource: null}
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
