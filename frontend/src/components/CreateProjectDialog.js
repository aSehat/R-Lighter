import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';


export default function CreateProjectDialog(props) {
  const { onClose, selectedValue, inputprojectFields, open } = props;
  const [projectFields, setProjectFields] = React.useState(() => {
    if (inputprojectFields){
      return inputprojectFields
    }
    return {
      name: "",
      link: "",
      prefix: "",
      language: "en"
    }
  });

  const changeFormValue = (event, field) => {
    let newProjectField = {};
    newProjectField[field] = event.target.value;
    setProjectFields({
      ...projectFields,
      ...newProjectField
    });
  }

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Create Project</DialogTitle>
      <form
      className="resource-form"
      onSubmit={event => {
        event.preventDefault();
        props.onConfirm(projectFields);
      }}
    >
          <div className = "field">
          <TextField value={projectFields.name} onChange={(e) => changeFormValue(e, "name")} label="Project Name"  style={{ width: 300 }} variant="outlined" required={true} />
          </div>
          <div className = "field">
          <TextField value={projectFields.link} onChange={(e) => changeFormValue(e, "link")} label="Project Link"  style={{ width: 300 }} variant="outlined" required={true}/>
          </div>
          <div className = "field">
          <TextField value={projectFields.prefix} onChange={(e) => changeFormValue(e, "prefix")} label="Project Prefix"  style={{ width: 300 }} variant="outlined" required={true}/>
          <div class="field">
              <Button
                  type="submit"
                  className="create-resource"
                  variant="contained"
                  color="primary"
              >
                  Create Project
              </Button>
            </div>
          </div>
        </form>
    </Dialog>
  );
}