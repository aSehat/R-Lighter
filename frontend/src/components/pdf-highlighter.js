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

type Props = {};

type State = {
  url: string,
  highlights: Array<T_Highlight>,
  classes: Array<{resourcetype: string}>
};

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({ comment }) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
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
    classes: [
      {
        resourcetype: 'Class',
      }],
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

  addHighlight(highlight: T_NewHighlight) {
    const { highlights, classes, resources } = this.state;

    console.log("Saving highlight", highlight);
    const id = getNextId();
    if(highlight.resource.type == "Class"){
      this.setState({
        classes: [{ resourcetype: highlight.resource.resourceName},...classes]
      })
    }else{
      this.setState({
        resources: [ { 
          resourcename: highlight.resource.resourceName, 
          type: highlight.resource.type,
          id: id 
        },...resources]
      })
    }
    this.setState({
      highlights: [{ ...highlight, id: id }, ...highlights],
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

    return (
      <div className="App" style={{ display: "flex", height: "100vh" }}>
        <Sidebar
          highlights={highlights}
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
                      comment={highlight.resource}
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
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={popupContent =>
                        setTip(highlight, highlight => popupContent)
                      }
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