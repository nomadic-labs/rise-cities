import React from "react"
import PropTypes from "prop-types"

export default function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {props.headComponents}
        <style type="text/css">{`
            @keyframes rotation {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(359deg);
              }
            }

            #page-loader {
              position: fixed;
              top: 0;
              left: 0;
              background: #ffffff;
              z-index: 99999;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              opacity: 1;
              transition: opacity 300ms ease, width 100ms linear 300ms;
            }

            #page-loader .circle {
              height: 30px;
              width: 30px;
              border-radius: 30px;
              background: linear-gradient(160deg, #FFCD44 0%, #FFCD44 20%, #46B27E 100%);
              animation: rotation 4s infinite linear;
            }

            #page-loader.hidden {
              width: 0%;
              opacity: 0;
            }
        `}</style>
      </head>
      <body {...props.bodyAttributes}>
        <div id="page-loader">
          <div aria-label="Loading..." className="circle" />
        </div>
        {props.preBodyComponents}
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
    </html>
  )
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}
