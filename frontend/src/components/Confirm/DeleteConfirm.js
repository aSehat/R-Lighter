import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

/*
Delete Confirm Component
opens up a popup in which the user can choose to confirm or cancel their deletion action

Props:
onClose: (function handles the confirmation. if a parameter "value" is passed to the function, it assumes that you wish to confirm the action)
valueProp: the paramater passed into onClose (can pass in a boolean or a specific state value). provided as a prop from parent component
deleteLabel: title of delete confirmation page
deleteMessage: message provided by delete confirmation page
other: other arguments provided to the prop
*/ 
function DeleteConfirm(props) {
  const { onClose, value: valueProp, open, deleteLabel, deleteMessage, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const radioGroupRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      onEntering={handleEntering}
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">Delete {deleteLabel}</DialogTitle>
      <DialogContent dividers>
        <p>{deleteMessage}</p>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirm;