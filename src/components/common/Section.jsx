import React from "react";
import Grid from "@material-ui/core/Grid";

export default (props) => {
  return (
    <section {...props}>
      { props.children }
    </section>
  );
};


