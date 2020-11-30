import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { blue } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

export default function ProjectDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, inputType, inputProjectFields, open } = props;
  console.log(props);
  console.log(inputProjectFields);
  const [projectFields, setProjectFields] = React.useState(() => {
    if (inputProjectFields) {
      console.log("input", inputProjectFields);
      return inputProjectFields;
    }
    return {
      name: "",
      link: "",
      prefix: "",
      language: "en"
    }
  });

  useEffect(() => {
    if (inputProjectFields){
      setProjectFields(inputProjectFields);
    }
  }, [inputProjectFields])

  const changeFormValue = (event, field) => {
    let newProjectField = {};
    newProjectField[field] = event.target.value;
    setProjectFields({
      ...projectFields,
      ...newProjectField
    });
    console.log(projectFields);
  }

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">{inputType} Project</DialogTitle>
      <form
      className="resource-form"
      onSubmit={event => {
        event.preventDefault();
        handleClose();
        props.onConfirm(projectFields);
      }}
    >
          <div className = "field">
          <TextField value={projectFields.name} onChange={(e) => changeFormValue(e, "name")} label="Project Name"  style={{ width: 333.89 }} variant="outlined" required={true} />
          </div>
          {(inputType === "Create") &&
          <div className = "field">
            <TextField value={projectFields.link} onChange={(e) => changeFormValue(e, "link")} label="Project Link"  style={{ width: 333.89 }} variant="outlined" required={true}/>
          </div>
          }
          <div className = "field">
          <TextField value={projectFields.language} onChange={(e) => changeFormValue(e, "language")} label="Project Language"  style={{ width: 333.89 }} variant="outlined" required={true}/>
          </div>
          <div className = "field">
          <TextField value={projectFields.prefix} onChange={(e) => changeFormValue(e, "prefix")} label="Project Prefix"  style={{ width: 333.89 }} variant="outlined" required={true}/>
            <div class="field">
              <Button
                  type="submit"
                  className="create-resource"
                  variant="contained"
                  color="primary"
              >
                  {inputType} Project
              </Button>
              {(inputType === "Update") &&
                <Button
                    style={{"margin-left": "10px"}}
                    className="create-resource"
                    variant="contained"
                    color="secondary"
                    onClick={(e) => {
                      handleClose();
                      if (window.confirm("Delete this project? (THIS ACTION CANNOT BE UNDONE)")) {
                        // delete the project
                        alert("project deleted!");
                        props.onDelete(projectFields);
                      } else {
                        // do nothing
                        alert("no deletion took place :)");
                      }
                    }}
                >
                  Delete Project
                </Button>
              }
            </div>
          </div>
        </form>
    </Dialog>
  );
}