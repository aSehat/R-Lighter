import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';


const useStyles = makeStyles((theme) => ({
  fab: {
    zIndex: 5,
    position: 'absolute',
    bottom: theme.spacing(12),
    right: theme.spacing(3),
  }
}));

const SaveBtn = (props) => {
  const classes = useStyles();

  return (
    <div>
      <Fab 
        href='#'
        color="primary" aria-label="save" className={classes.margin, classes.fab}  
        onClick={() => this.save()}>
        <SaveIcon />
      </Fab>
    </div>
  );
};

export default SaveBtn;
