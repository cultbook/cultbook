import { createMuiTheme } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: pink,
  },
  typography: {
    fontFamily:['gryphius-mvb'],
    button: {
      wordSpacing: '4px',
    },
  }
})

export default darkTheme;
