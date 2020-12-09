// @flow
/* eslint import/no-webpack-loader-syntax: 0 */

import React, { Component } from "react";
import PDFWorker from "worker-loader!pdfjs-dist/lib/pdf.worker";
import axios from 'axios';
import { saveAs } from 'file-saver';
import HighlightPopup from './HighlightPopup';
import SaveBtn from '../layout/SaveBtn';
import ExportAnnotBtn from '../layout/ExportAnnotBtn';
import BibTex from '../layout/BibTex';

import {
  PdfLoader,
  PdfHighlighter,
  Popup,
  AreaHighlight,
  setPdfWorker
} from "react-pdf-highlighter";


import Tip from "./Tip";
import Spinner from "./Spinner";
import Highlight from "./Highlight"
import Sidebar from "./Sidebar";

import type {
  T_Highlight,
  T_NewHighlight
} from "react-pdf-highlighter/src/types";

import "../style/App.css";
setPdfWorker(PDFWorker);

type Props = {};

type State = {
  projectId: String
  token: String,
  url: String,
  changedBibtex: Boolean,
  bibtex: String,
  highlights: Array<T_Highlight>,
  classes: String[],
  resources: String[],
  deletedHighlights: String[],
  unsavedHighlights: String[],
};
/* Creates a temporary random id for new annotations (replaced in the backend MongoDB ObjectID) */
const getNextId = () => String(Math.random()).slice(2);

/* Grabs the ID of a given annotation from the URI to snap to the associated annotated text in the PDF viewer*/
const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

/* Resets the document location, without a highlight URI */
const resetHash = () => {
  document.location.hash = "";
};

class PDFHighlights extends Component<Props, State> {
  state = {
    projectId: this.props.match.params.id, // the projectID as given from the queried uri
    token: localStorage.getItem("token"),  // session id (token) for user auth
    url: "",                               // url of the PDF
    changedBibtex: false,                  // boolean used to determine if the user changed the bibtex
    bibtex: "",                            // bibtex string  
    unsavedHighlights: [],                 // new highlights created that are currently not saved in the database          
    deletedHighlights: [],                 // highlights in which the user has deleted from the PDF viewer
    highlights: [],                        // current visible highlights (including saved and unsaved)
    classes: ["Class"],                    // list of class resources
    resources: []                          // list of all resources currently visible in the PDF viewer
  };

  state: State;

  // resets all the highlights (clears all highlights from the highlights list)
  resetHighlights = () => {
    this.setState({
      highlights: []
    });
  };

  /*Scrolls to the given location of a selected highlight when the user clicks with any annotation from the sidebar*/
  scrollViewerTo = (highlight: any) => {};

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  /*
    Save function calls the backend annotation endpoint to:
    - save unsaved highlights
    - delete highlights in the deletedHighlights array
    - create/update bibtex citations
  */
  save = () => {
    const deletedAnnotations = this.state.deletedHighlights.map((h) => h._id)
    const unsavedHighlights = this.state.unsavedHighlights.map((h) => {
      const { saved, id, ...rest} = h
      return rest;
    })
    let headers = {
      'x-auth-token': this.state.token // for authentication and user id
    };
    let requestBody = {}
    if(this.state.changedBibtex){
      requestBody = {project_id: this.state.projectId, annotations: unsavedHighlights, deletedAnnotations: deletedAnnotations, bibtex: this.state.bibtex}
    }else{
      requestBody = {project_id: this.state.projectId, annotations: unsavedHighlights, deletedAnnotations: deletedAnnotations}
    }
    axios.post('/api/annotation', requestBody, {headers: headers});
    this.setState({
      unsavedHighlights: [] // unsaved highlights is reset after each save, as all unsaved highlights are already saved in the backend
    });
  }

  /*
    export function first saves the highlights. After it finishes 
    saving all the highlights, another API call is made to /api/serialization 
    to get the serialized string of the RDF file. This in turn is converted into a Blob object
    which is the then downloaded to the user's browser as exportedResources.ttl 
  */
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

  /* 
    calls the /api/project to grab all annotations related to the project Id. 
    this function prepopulates the state with all the highlights, bibtex string, resource names, 
    and classes into the state.
  */
  componentDidMount() {
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
        bibtex: res.data.project.bibtex,
        url: "/api/pdf?url=" + res.data.project.link,
        highlights: savedAnnotations,
        resources: [...res.data.resources, ...res.data.classes],
        classes: ["Class",...res.data.classes] 
      })
    });

  }


  getHighlightById(id: string) {
    const { highlights } = this.state;

    return highlights.find(highlight => highlight.id === id);
  }
  
  /* 
    Creates a new resource highlight (adds the resource name to the classes list 
    if the resource is of type class, and adds the resource to the resoruces list)
  */
  createNewResource(highlight){
    const {classes, resources} = this.state;
    if(highlight.resource.type === "Class"){
      this.setState({
        classes: [...classes, highlight.resource.resourceName]
      }) 
    }
    this.setState({
      resources: [...resources, highlight.resource.resourceName]
    })
  }
  
  /* 
    Recursively determines which highlights to delete given the highlight to delete and the list of highlights.
    If the highlight is class or resource annotation, then it will recursively delete all resources that stem from it, 
    as well as the property annotations (property annotations are annotations that were made after the associated resource is created)
  */
  async getAllDeleteAnnotations(highlight, highlights){ //returns all REMAINING HIGHLIGHTS
    /*
      Base case: if the highlight is a property or has no resource type (which is the rdf:type usually), 
      then return this highlight as well as all remaining highlights that are not deleted 
    */
    if(highlight.resource.type === "Property" || highlight.resource.type === ""){
      return Promise.resolve(
        {
          remainingHighlights: highlights.filter((h) => h.id !== highlight.id),
          deletedHighlights: highlight.saved ? [highlight] : []
        }
      ); 
    }
    /* 
      Filters the classes and resources list so that all 
      highlights deleted are also deleted from these lists
    */
    if(highlight.resource.type === 'Class'){
      this.setState({
        classes: this.state.classes.filter(resource => resource !== highlight.resource.resourceName)
      })
    }
    if(highlight.resource.type !== 'Property'){
      this.setState({
        resources: this.state.resources.filter(resource => resource !== highlight.resource.resourceName)
      })
    }
    var remainingHighlights = [];
    var childrenHighlights = [];
    var deletedHighlights = [];
    /* Iterates through all the highlights (annotations). it sorts the highlights into childrenHighlights, 
       which are highlights referenced by the current highlight param (of which are deleted recursively), 
       as well as the remainingHighlights, that are not deleted based on the immediate highlight param */
    highlights.forEach((h) => {
      if (h.id !== highlight.id && (h.resource.type === highlight.resource.resourceName || h.resource.resourceName === highlight.resource.resourceName)){
        childrenHighlights.push(h);
      } else if (h.id !== highlight.id){
        remainingHighlights.push(h);
      }
    })
    /* Recursive call for each child highlight. DeletedHighlights of the current depth are concatenated with deleted highlights from lower depths*/
    for(let i = 0; i < childrenHighlights.length; i++){
      let result = await this.getAllDeleteAnnotations(childrenHighlights[i], remainingHighlights);
      remainingHighlights = result.remainingHighlights;
      deletedHighlights = deletedHighlights.concat(result.deletedHighlights);
    }
    deletedHighlights = highlight.saved ? [highlight, ...deletedHighlights] : [...deletedHighlights]
    return Promise.resolve({remainingHighlights, deletedHighlights});  
  }

  /* Deletes a given highlight as well as all resources and properties referenced by that given highlight recursively */
  async deleteResource(highlight){
    const {remainingHighlights, deletedHighlights}= await this.getAllDeleteAnnotations(highlight, this.state.highlights);
    const unsavedHighlights = remainingHighlights.filter(h => !h.saved); 
    this.setState({
      highlights: remainingHighlights,
      unsavedHighlights: unsavedHighlights,
      deletedHighlights: [...this.state.deletedHighlights, ...deletedHighlights]
    })
  }

  /* 
    Adds a created highlight to the highlights page, added the new highlight to the unsavedHighlights list (highlights that still need to be saved) 
    as well as the full highlights list(what is displayed)*/
  addHighlight(highlight: T_NewHighlight) {
    const { highlights, unsavedHighlights } = this.state;
    const {content, position, resource } = highlight;
    const id = getNextId();
    if(highlight.resource.type === "Class" || highlight.resource.type !== "Property"){
      this.createNewResource(highlight)
    }
    const property = resource.propertyType
    const newAnnotation = {content, position, resource: {resourceName: resource.resourceName, type: resource.type, property: {label: property}}, id: id, saved: false };
    this.setState({
      unsavedHighlights:[...unsavedHighlights, newAnnotation], 
      highlights: [...highlights, newAnnotation],
    });
  }
  /* Provided by the library. Allows users to update the area highlight box for screenshots */
  updateHighlight(highlightId: string, position: Object, content: Object) {
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

  /* adds bibtex citations to the state if saved */
  handleBibtex = (bibtex) => {
    this.setState({
      bibtex: bibtex,
      changedBibtex: true
    })
  }

  render() {
    const { highlights } = this.state;
  
    return (
      <div className="App" style={{ display: "flex", height: "100vh" }}>
        <Sidebar
          highlights={highlights}
          resources={this.state.resources}
          classes={this.state.classes}
          resetHighlights={this.resetHighlights}
          deleteResource={(highlight) => this.deleteResource(highlight)}
        />
        <div
          style={{
            height: "100vh",
            width: "75vw",
            position: "relative"
          }}
        >
          <div>
            <SaveBtn onClick={() => this.save()} />
            <br/>
            <ExportAnnotBtn onClick={() => this.export()} />
            <br/>
            <BibTex value={this.state.bibtex} updateBibtex={this.handleBibtex}/>
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
                      resource={highlight.resource}
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
