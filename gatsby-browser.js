/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import "babel-polyfill";

import wrapWithProvider from "./src/redux/wrapWithProvider";

export const wrapRootElement = wrapWithProvider

export const onClientEntry = () => {
  document.getElementById('page-loader').classList.add('hidden')
}