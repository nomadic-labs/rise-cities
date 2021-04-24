import React from "react";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import bmwfLogo from '../../assets/images/logo_bmwf.svg'
import riseLogo from '../../assets/images/RISE_wordmark.svg'
import Wordmark from "../../assets/images/svgs/RISE_wordmark.svg"
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import EmailIcon from '@material-ui/icons/Email';


const Footer = () => (
  <footer id="footer">
    <div className="bg-light text-black footer-main pt-10 pb-8">
      <Container>
        <Grid container justify="space-between">
          <Grid item sm={5} md={4} lg={3} className="footer-left">
            <p className="m-0 text-small">Presented by</p>
            <img src={bmwfLogo} alt="The BMW Foundation Herbert Quandt" className="mt-4 mb-4" style={{ width: '220px'}} />
            <p className="text-small">The BMW Foundation Herbert Quandt promotes responsible leadership and inspires leaders worldwide to work towards a more peaceful, just and sustainable future.</p>
            <ul>
              <li>
                <a href="https://www.facebook.com/BMWFoundation/" target="_blank" rel="noopener noreferrer">
                  <FacebookIcon />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/bmwfoundation" target="_blank" rel="noopener noreferrer">
                  <TwitterIcon />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/bmwfoundation/" target="_blank" rel="noopener noreferrer">
                  <InstagramIcon />
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/bmw-foundation/" target="_blank" rel="noopener noreferrer">
                  <LinkedInIcon />
                </a>
              </li>
            </ul>
          </Grid>
          <Grid item sm={5} md={4} lg={3} className="footer-right">
            <Wordmark style={{ maxWidth: '200px', width: '220px', height: "64px" }} alt="RISE Cities" />
            <a href={`mailto:risecities@bmw-foundation.org`} target="_blank" rel="noopener noreferrer" className="pretty-link">
              <div className="display-flex align-center text-normal mt-2">
                <EmailIcon /><span className="ml-2">risecities@bmw-foundation.org</span>
              </div>
            </a>
          </Grid>
        </Grid>
      </Container>
    </div>
    <div className="bg-white text-black">
      <Container>
        <div className="display-flex footer-legal text-xs">
          <span>© 2021 BMW Foundation</span>
          <span className="m-0"><a href="https://bmw-foundation.org/en/legal-notice/" target="_blank" rel="noopener noreferrer" className="pretty-link text-normal">Legal notice</a></span>
          <span className="m-0"><a href="https://bmw-foundation.org/privacy-policy/" target="_blank" rel="noopener noreferrer" className="pretty-link text-normal">Privacy Policy</a></span>
        </div>
      </Container>
    </div>
  </footer>
)

export default Footer;
