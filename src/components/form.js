import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import MuiTextField from '@material-ui/core/TextField';

import { useField } from 'formik'

const useStyles = makeStyles(theme => ({
  textField: {

  },
  input: {
    color: '#f00',
  },
}))

export const TextField = ({ label, ...props }) => {
  const classes = useStyles()
  const [field, meta] = useField(props)
  return (
    <MuiTextField className={classes.textField}
                  InputProps={{
                    className: classes.input
                  }}
                  error={!!meta.error} helperText={meta.error}
                  {...field} {...props}/>
  )
}
