import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';


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
  }
}));

export default function BibTex() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  // const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div className={classes.modal}>
      <h2>BibTex Citation</h2>
      <TextField
          id="outlined-multiline-flexible"
          label="BibTex"
          multiline
          // onChange={this.handleChange('multiline')}
          className={classes.textField}
          margin="normal"
          // helperText="hello"
          variant="outlined"
        />
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

