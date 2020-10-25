import React from "react";

import type { T_Highlight } from "react-pdf-highlighter/src/types";
type T_ManuscriptHighlight = T_Highlight;

type Props = {
  highlights: Array<T_ManuscriptHighlight>,
  resetHighlights: () => void,
  toggleDocument: () => void
};

const updateHash = highlight => {
  document.location.hash = `highlight-${highlight.id}`;
};

function Sidebar({ highlights, resources, classes, toggleDocument, resetHighlights }: Props) {
  // const highlightsWithResources = highlights.map(highlight => {
  //   let resource;
  //   if(highlight.list == "resources"){
  //     resource = resources.find(item => item.name == highlight.resource)
  //   } else {
  //     resource = classes.find(item => item.name == highlight.resource)
  //   }
  //   console.log({...highlight,resource: resource})
  //   return {...highlight,resource: resource}
  // })
  // console.log(highlightsWithResources);

  return (
    <div className="sidebar" style={{ width: "25vw" }}>
      <div className="description" style={{ padding: "1rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>RDF Annotations</h2>

        <p>
          <small>
            To create area highlight hold ⌥ Option key (Alt), then click and
            drag.
          </small>
        </p>
      </div>

      <ul className="sidebar__highlights">
        {highlights.map((highlight, index) => (
          <li
            key={index}
            className="sidebar__highlight"
            onClick={() => {
              updateHash(highlight);
            }}
          >
            <div>
          <strong>{highlight.list}: {highlight.class}/{highlight.resource}</strong>
              {highlight.resource ? (
                <blockquote style={{ marginTop: "0.5rem" }}>
                  {`${highlight.content.text.slice(0, 90).trim()}…`}
                </blockquote>
              ) : null}
              {highlight.content.image ? (
                <div
                  className="highlight__image"
                  style={{ marginTop: "0.5rem" }}
                >
                  <img src={highlight.content.image} alt={"Screenshot"} />
                </div>
              ) : null}
            </div>
            <div className="highlight__location">
              Page {highlight.position.pageNumber}
            </div>
          </li>
        ))}
      </ul>
      <div style={{ padding: "1rem" }}>
        <button onClick={toggleDocument}>Toggle PDF document</button>
      </div>
      {highlights.length > 0 ? (
        <div style={{ padding: "1rem" }}>
          <button onClick={resetHighlights}>Reset highlights</button>
        </div>
      ) : null}
    </div>
  );
}

export default Sidebar;