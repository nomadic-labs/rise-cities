/* eslint-disable no-underscore-dangle */

import { SheetsRegistry } from 'jss';
import { createMuiTheme, createGenerateClassName } from '@material-ui/core/styles';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#F6E7E2",
      main: "#E57A68", // peach
      dark: "#914b40",
    },
    secondary: {
      light: "#9DAAB7",
      main: "#535F6C", // purple
      dark: "#363648",
    },
    error: {
      light: "#FB9D5D",
      main: "#FA7921", // orange
      dark: "#A83512",
    },
    background: {
      default: "#fff",
    }
  },
  typography: {
    fontFamily: `'Montserrat', 'Helvetica', 'Arial', sans-serif`,
    fontSize: 18,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    color: 'hsla(0, 0%, 0%, .8)',
    display1: {
      fontFamily: `'Montserrat', 'Helvetica', 'Arial', sans-serif`,
      letterSpacing: "0.05rem",
      textTransform: "uppercase",
      fontSize: "3.333em",
      color: 'hsla(0, 0%, 0%, .8)',
      fontWeight: 700,
    },
    display2: {
      fontFamily: `'Montserrat', 'Helvetica', 'Arial', sans-serif`,
      letterSpacing: "0.05rem",
      textTransform: "uppercase",
      fontSize: "2.222em",
      color: 'hsla(0, 0%, 0%, .8)',
      fontWeight: 700,
    },
    display3: {
      fontFamily: `'Montserrat', 'Helvetica', 'Arial', sans-serif`,
      letterSpacing: "0.05rem",
      textTransform: "uppercase",
      fontSize: "1.667em",
      color: 'hsla(0, 0%, 0%, .8)',
      fontWeight: 700,
    },
    display4: {
      fontFamily: `'Montserrat', 'Helvetica', 'Arial', sans-serif`,
      textTransform: "none",
      fontSize: "1.14em",
      color: 'hsla(0, 0%, 0%, .8)',
      fontWeight: 700,
    },
    title: {
      fontFamily: `'Montserrat', 'Helvetica', 'Arial', sans-serif`,
      letterSpacing: "0.05rem",
      textTransform: "uppercase",
      color: 'hsla(0, 0%, 0%, .8)',
      fontWeight: 700,
    },
    headline: {
      fontFamily: `'Montserrat', 'Helvetica', 'Arial', sans-serif`,
      letterSpacing: "0.05rem",
      textTransform: "uppercase",
      fontSize: "1.667em",
      color: 'hsla(0, 0%, 0%, .8)',
      fontWeight: 700,
      borderBottom: "2px solid #e70094",
      marginBottom: "1em",
    },
    button: {
      textTransform: "none",
      color: "#fff",
    },
    body1: {
      fontFamily: `'Libre Baskerville', 'Georgia', serif`,
      fontSize: 18,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      color: 'hsla(0, 0%, 0%, .8)',
    },
  },
  status: {
    danger: "#FA7921",
  }
});


function createPageContext() {
  return {
    theme,
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName(),
  };
}

export default function getPageContext() {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext();
  }

  return global.__INIT_MATERIAL_UI__;
}