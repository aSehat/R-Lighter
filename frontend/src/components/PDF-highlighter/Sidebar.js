import React, { useEffect } from "react";
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import DeleteConfirm from '../Confirm/DeleteConfirm';
import Typography from '@material-ui/core/Typography';
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
  }, 
  subsection: {
    fontWeight: 'bold'
  }, 
  highlightInfo: {
    marginTop: '10px'
  }
}))

type T_ManuscriptHighlight = T_Highlight;

type Props = {
  highlights: Array<T_ManuscriptHighlight>, // list of all highlights
  deleteResource: (highlight: T_Highlight) => void, // function to delete a given highlight (along with its cascaded resources and properties)
};

/* snaps the a given highlight in the PDF by adding the highlight id to the document */
const updateHash = highlight => {
  document.location.hash = `highlight-${highlight.id}`;
};

function Sidebar({ highlights, deleteResource }: Props) {
  const styleclasses = useStyles();
  const [deleteValue, setDeleteValue] = React.useState(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  /* 
    function which stores the highlight the user wants to delete 
    (stored temporarily for confirmation purposes )
  */
  const deleteHighlight = (highlight) => {
    setDeleteValue(highlight);
  }

  /* 
    function used to open confirmation modal for deletion
  */
  const handleOpen = (openLabel) => {
    if(openLabel === "delete"){
      setDeleteOpen(true);
    }
  };

  /* 
    calls handleOpen when the deleteValue (which stores the deleted highlight) changes
  */
  useEffect(() => {
    if (deleteValue){
      handleOpen("delete");
    }
  }, [deleteValue])

  /* 
    resets the sidebar's deletion values and closes the delete confirmation modal
    If the user confirmed a resource deletion, newValue will return an object, which 
    triggers the deleteResource prop that deletes the highlight from the user's current 
    annotations. Otherwise, deleteResource is not called. 
  */
  const handleDeleteClose = (newValue) => {
    setDeleteOpen(false);
    setDeleteValue(null);
    if (newValue) {
      deleteResource(newValue);
    }
  };

  return (
    <>
    {/* Confirmation popup for delete, when it is closed, it calls handleDeleteClose that 
    determines whether or not to delete the given annotation */}
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
              <Typography className={styleclasses.subsection} variant="h5" component="h2">
                {highlight.resource.resourceName}
              </Typography>
              {highlight.resource ? (
                <div className={styleclasses.highlightInfo}>
                <Typography className={styleclasses.subsection} variant="subtitle2" component="h2">
                    Annotation Type
                </Typography>
                <Typography variant="body2" component="p">
                  {highlight.resource.type}
                </Typography>
                <Typography className={styleclasses.subsection} variant="subtitle2" component="h2">
                    Property
                </Typography>
                <Typography variant="body2" component="p">
                {highlight.resource.property.label}
                </Typography>
                <blockquote style={{ marginTop: "0.5rem" }}>
                  {`${highlight.content.text.slice(0, 90).trim()}…`}
                </blockquote>
                </div>
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
    </div>
    </>
  );
}

export default Sidebar;