import { createMuiTheme } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
console.log(pink)
const crimson = {
  50: "#ffebf0",
  100: "#ffccd7",
  200: "#f297a1",
  300: "#ea6e7c",
  400: "#f7485d",
  500: "#fe2d44",
  600: "#ee2243",
  700: "#dc143c",
  800: "#cf0534",
  900: "#c10028",
  "A100": "#f6badc",
  "A200": "#ef8ac6",
  "A400": "#dc14a0",
  "A700": "#b20089"
}

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: crimson,
  },
  typography: {
    fontFamily:['gryphius-mvb'],
    button: {
      wordSpacing: '4px',
    },
  }
})

export default darkTheme;
