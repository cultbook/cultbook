import React from "react";
import { useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
  const backgroundColor = theme.palette.background.default
  const selectedBackgroundColor = theme.palette.action.selected
  const color = theme.palette.text.primary
  return ({
    calendar: {
      backgroundColor,
      fontFamily: "inherit",
      fontWeight: "bold",
      color,

      "& .react-datepicker__header": {
        backgroundColor,
        color
      },
      "& .react-datepicker-time__header": {
        backgroundColor,
        color
      },
      "& .react-datepicker__current-month": {
        backgroundColor,
        color
      },
      "& .react-datepicker__day-name": {
        backgroundColor,
        color
      },
      "& .react-datepicker__time-container .react-datepicker__time": {
        backgroundColor
      },
      "& .react-datepicker__day--selected": {
        backgroundColor: selectedBackgroundColor,
      },
      "& .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected": {
        backgroundColor: selectedBackgroundColor
      }
    },
    time: {
      color
    },
    day: {
      color
    }
  })
})

const DatePickerField = ({ ...props }) => {
  const classes = useStyles()
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  return (
    <DatePicker
      {...field}
      {...props}
      selected={(field.value && new Date(field.value)) || null}
      calendarClassName={classes.calendar}
      timeClassName={() => classes.time}
      dayClassName={() => classes.day}
      onChange={val => {
        setFieldValue(field.name, val);
      }}
    />
  );
}

export default DatePickerField
