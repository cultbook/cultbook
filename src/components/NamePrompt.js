import React, {useState} from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Form, Formik } from 'formik';

import {CultSchema} from "../validations"
import {TextField} from "./form"

export default function NamePrompt({
  openPrompt="Open form dialog", prompt="name?",
  submitText="Submit", cancelText="Cancel",
  title="what name should we use?",
  onSubmit, schema=CultSchema
}) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = ({name}) => {
    handleClose()
    onSubmit && onSubmit(name)
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>
        {openPrompt}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <Formik
          initialValues={{name: ""}}
          onSubmit={handleSubmit}
          validationSchema={schema}
        >
          <Form>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {prompt}
              </DialogContentText>
              <TextField name="name" type="text" placeholder="name" autoFocus/>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                {cancelText}
              </Button>
              <Button type="submit" color="primary">
                {submitText}
              </Button>
            </DialogActions>
          </Form>
        </Formik>
      </Dialog>
    </div>
  );
}
