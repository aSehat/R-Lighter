import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


const useStyles = makeStyles((theme) => ({
  fab: {
    zIndex: 5,
    position: 'absolute',
    bottom: theme.spacing(20),
    right: theme.spacing(3),
  }
}));

const SaveAnnotBtn = (props) => {
  const classes = useStyles();

  return (
    <div>
      <Fab 
        href='#'
        color="primary" aria-label="export" className={classes.margin + ' ' + classes.fab}  
        onClick={() => props.onClick()}>
        <ExitToAppIcon />
      </Fab>
    </div>
  );
};

export default SaveAnnotBtn;
