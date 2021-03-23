import React from "react";
import { StaticQuery, graphql, Link } from "gatsby"
import T from "../common/Translation"

import { HOME_URLS } from '../../utils/constants'

import lightLogo from "../../assets/images/nawl-logo-white.svg"

const Header = props => (
  <StaticQuery
    query={graphql`
      query {
        allPages {
          edges {
            node {
              id
              title
              slug
            }
          }
        }
      }
    `}
    render={data => {
      const currentLang = props.pageData ? props.pageData.lang : "en";
      const home = HOME_URLS[currentLang];
      const moduleClass = props.pageData && props.pageData.template === "course-module.js" ? "module" : ""
      return (
        <nav className={`navbar ${moduleClass}`}>
          <div className="site-title d-none">
            <Link to={home}>
              <span className="title-script"><T id="title_part_1" /></span>
              <span className="title-print"><T id="title_part_2" /></span>
            </Link>
          </div>
          <div className="logo">
            <a href={'https://nawl.ca/'}><img src={lightLogo} alt="NAWL | ANFD" /></a>
          </div>
        </nav>
      );
    }}
  />
)

export default Header;
