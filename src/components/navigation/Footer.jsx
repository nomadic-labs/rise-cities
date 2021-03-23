import React from "react";
import { Link } from "gatsby"
import Hidden from '@material-ui/core/Hidden';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Popover from "@material-ui/core/Popover";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'

import {
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon,
} from 'react-share';


import PopupNavigation from "./PopupNavigation"
import T from "../common/Translation"

import { HOME_URLS } from "../../utils/constants"

const isClient = typeof window !== 'undefined';

class Footer extends React.Component {
  state = {
    anchorEl: null,
    shareAnchor: null,
  };

  openMenu = e => {
    this.setState({ anchorEl: e.currentTarget });
  };

  closeMenu = e => {
    this.setState({ anchorEl: null });
  };

  openShareButtons = e => {
    this.setState({ shareAnchor: e.currentTarget });
  };

  closeShareButtons = e => {
    this.setState({ shareAnchor: null });
  };

  render() {
    const { props, openMenu, closeMenu, openShareButtons, closeShareButtons } = this;
    const { anchorEl, shareAnchor } = this.state;
    const translation = props.pageData ? props.pageData.translation : null
    const shareUrl = props.location ? props.location.href : isClient ? window.location.origin : "";
    const shareTitle = props.pageData ? props.pageData.title : "Feminist Law Reform 101"
    const currentLang = props.pageData ? props.pageData.lang : "en";
    const translationLabel = currentLang === 'en' ? 'Français' : 'English'
    const home = HOME_URLS[currentLang];

    return (
      <footer>
        <PopupNavigation anchorEl={anchorEl} closeMenu={closeMenu} />
        <Popover
          id="share-buttons"
          role="menu"
          anchorEl={shareAnchor}
          open={Boolean(shareAnchor)}
          onClose={closeShareButtons}
          className="share-buttons-menu"
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
          <Card variant="outlined" className="share-buttons-popover">
            <CardContent style={{ padding: "0.5rem" }}>
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <TwitterIcon size={36} round />
              </TwitterShareButton>

              <FacebookShareButton url={shareUrl} quote={shareTitle}>
                <FacebookIcon size={36} round />
              </FacebookShareButton>

              <LinkedinShareButton url={shareUrl} title={shareTitle}>
                <LinkedinIcon size={36} round />
              </LinkedinShareButton>

              <EmailShareButton url={shareUrl} subject={shareTitle}>
                <EmailIcon size={36} round />
              </EmailShareButton>
            </CardContent>
          </Card>
        </Popover>
        <Hidden smDown>
          <Container maxWidth="lg">
            <Grid container>
              <Grid item xs={false} md={4} className="footer-section footer-left">
                <Link to={home} className="site-title no-text-decoration">
                  <span className="title-script"><T id="title_part_1" /></span>
                  <span className="title-print"><T id="title_part_2" /></span>
                </Link>
              </Grid>
              <Grid item xs={6} md={4} className="footer-section footer-center">
                <button
                  onClick={openShareButtons}
                  aria-owns={shareAnchor ? "share-buttons" : null}
                  aria-haspopup="true"
                >
                  <T id="share" />
                </button>
                {/*<Button><T id="download_syllabus" /></Button>*/}
                {
                  translation &&
                  <Link to={translation}>
                    {translationLabel}
                  </Link>
                }

              </Grid>
              <Grid item xs={6} md={4} className="footer-section align-right footer-right">
                <button
                  onClick={openMenu}
                  aria-owns={anchorEl ? "toc" : null}
                  aria-haspopup="true"
                  className="animated bounce"
                >
                  <KeyboardArrowUp style={{ marginRight: '0.5rem'}}/>
                  <T id="table_of_contents" />
                </button>
              </Grid>
            </Grid>
          </Container>
        </Hidden>
        <Hidden mdUp>
          <BottomNavigation
            style={{ height: "auto", justifyContent: "space-between", alignItems: "center"}}
          >
            <div className="d-flex">
              <button
                onClick={openMenu}
                aria-owns={anchorEl ? "toc" : null}
                aria-haspopup="true"
              >
                <T id="table_of_contents" />
              </button>
            </div>
            <div className="d-flex align-center">
              <button
                onClick={openShareButtons}
                aria-owns={shareAnchor ? "share-buttons" : null}
                aria-haspopup="true"
              >
                <T id="share" />
              </button>
              {/*<BottomNavigationAction label={<T id="download_syllabus" />} icon={<DownloadIcon />} />*/}
              {
                translation &&
                <Link to={translation}>
                  {translationLabel}
                </Link>
              }
              </div>
          </BottomNavigation>
        </Hidden>
      </footer>
    );
  }
}

export default Footer;
