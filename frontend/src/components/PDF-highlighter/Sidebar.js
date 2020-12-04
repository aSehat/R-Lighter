import React, { useEffect } from "react";
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import DeleteConfirm from '../Confirm/DeleteConfirm';
import type { T_Highlight } from "react-pdf-highlighter/src/types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    width: '80%',
    maxHeight: 435,
  },
  deleteResource: {
    float: "right",
    "&:hover": {
      color: "black"
    }
  }
}))

type T_ManuscriptHighlight = T_Highlight;

type Props = {
  highlights: Array<T_ManuscriptHighlight>,
  resetHighlights: () => void,
  toggleDocument: () => void
};

const updateHash = highlight => {
  document.location.hash = `highlight-${highlight.id}`;
};

function Sidebar({ highlights, resources, classes, toggleDocument, resetHighlights, deleteResource }: Props) {
  const styleclasses = useStyles();
  const [deleteValue, setDeleteValue] = React.useState(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const deleteHighlight = (highlight) => {
    setDeleteValue(highlight);
  }

  const handleOpen = (openLabel) => {
    if(openLabel === "delete"){
      setDeleteOpen(true);
    }
  };

  useEffect(() => {
    if (deleteValue){
      handleOpen("delete");
    }
  }, [deleteValue])

  const handleDeleteClose = (newValue) => {
    setDeleteOpen(false);
    setDeleteValue(null);
    if (newValue) {
      deleteResource(newValue);
    }
  };

  return (
    <>
    
    <DeleteConfirm
          classes={{
            paper: classes.paper,
          }}
          id="deleteAnnotationConfirm"
          keepMounted
          open={deleteOpen}
          deleteLabel="annotation"
          deleteMessage="Are you sure you want to delete this annotation? Deleting this may cause class instantiations to be deleted as well."
          onClose={handleDeleteClose}
          value={deleteValue}
    />
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
              <DeleteIcon id={highlight.id} className={styleclasses.deleteResource} onClick={() => deleteHighlight(highlight)}/>
          <strong>{highlight.resource.type} {highlight.resource.resourceName}</strong>
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
    </>
  );
}

export default Sidebar;