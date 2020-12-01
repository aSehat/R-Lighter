import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
const bibtexParser = require('bibtex-parse');

const useStyles = makeStyles((theme) => ({
  fab: {
    zIndex: 5,
    position: 'absolute',
    bottom: theme.spacing(28),
    right: theme.spacing(3),
    fontSize: '25px',
    fontWeight: 'bold'
  },
  modal: {
    zIndex: 5,
    position: 'absolute',
    top: '10vh',
    left: '50vw',
    width: 400,
    backgroundColor: 'white',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%'
  }
}));

export default function BibTex(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  // const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [bibtex, setBibtex] = React.useState("");
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBibtex = (e) => {
    setBibtex(e.target.value);
  }
  
  useEffect(() => {
    setBibtex(props.value);
  }, [props.value])

  const body = (
    <div className={classes.modal}>
      <h2>BibTex Citation</h2>
      <form
      className="bibtex-form"

      onSubmit={(event) => {
        event.preventDefault();
        try{
          const result = bibtexParser.entries(bibtex)
          if(result.length == 0){
            setError(true);
            setErrorMessage("Invalid BibTex Citation!");
          } else {
            props.updateBibtex(bibtex);
            setError(false);
            setErrorMessage("Updated");
          }
        } catch {
          setError(true);
          setErrorMessage("Invalid BibTex Citation!");
        }
      }}
    >
      <TextField
          id="outlined-multiline-flexible"
          label="BibTex"
          multiline
          error={error}
          helperText={errorMessage}
          value={bibtex}
          onChange={e => handleBibtex(e)}
          // onChange={this.handleChange('multiline')}  
          className={classes.textField}
          margin="normal"
          // helperText="hello"
          variant="outlined"
        />
        <Button
            type="submit"
            className="create-citation"
            variant="contained"
            color="primary"
        >
            Update Citation
        </Button>
      </form>
    </div>
  );
  
  return (
    <div>
      <Fab 
        href='#'
        color="primary" aria-label="bibtex" className={classes.margin, classes.fab}  
        onClick={handleOpen}
      >
        B
      </Fab>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </div>
  );
};

