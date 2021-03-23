import React from "react";
import { connect } from "react-redux";
import { Link } from "gatsby";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import T from "../common/Translation"

const mapStateToProps = state => {
  return {
    orderedPages: state.pages.orderedPages,
    currentLang: state.navigation.currentLang,
    pageData: state.page.data,
    pages: state.pages.pages,
  };
};

const NavigationModule = ({ page, order }) => {
  return (
    <MenuItem className="navigation-module" component={Link} to={page.slug} style={{ backgroundColor: 'transparent' }}>
      <div className="title">
        <T id="module" />{` ${order}: ${page.title}`}
      </div>
    </MenuItem>
  );
};

const PopupNavigation = props => {
  const { currentLang, pages, anchorEl, closeMenu, orderedPages } = props;
  const homePage = currentLang === "en" ? pages["nawl"] : pages["anfd"]
  return (
    <Menu
      id="toc"
      role="menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={closeMenu}
      className="table-of-contents"
      elevation={0}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <MenuItem className="navigation-module" component={Link} to={homePage ? homePage.slug : '/'} style={{ backgroundColor: 'transparent' }}>
        <div className="title">
          <T id="home" />
        </div>
      </MenuItem>
      {
        orderedPages.map((page, index) => {
          return <NavigationModule page={page} order={index + 1} key={page.id} />
        })
      }
    </Menu>
  );
}

export default connect(mapStateToProps, null)(PopupNavigation);
