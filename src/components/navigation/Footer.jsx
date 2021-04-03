import React from "react";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import bmwfLogo from '../../assets/images/logo_bmwf.svg'
import riseLogo from '../../assets/images/RISE_wordmark.svg'


const Footer = () => (
  <footer id="footer">
    <div className="bg-light text-black footer-main pt-10 pb-8">
      <Container>
        <Grid container justify="space-between">
          <Grid item md={3}>
            <p className="m-0 text-small">Presented by</p>
            <img src={bmwfLogo} alt="The BMW Foundation Herbert Quandt" className="mt-4 mb-4" style={{ width: '220px'}} />
            <p className="text-small">The BMW Foundation Herbert Quandt promotes responsible leadership and inspires leaders worldwide to work towards a more peaceful, just and sustainable future.</p>
          </Grid>
          <Grid item md={3}>
            <img src={riseLogo} alt="RISE Cities" />
          </Grid>
        </Grid>
      </Container>
    </div>
    <div className="bg-white text-black">
      <Container>
        <div className="display-flex footer-legal text-xs">
          <span>© 2021 Rise cities</span>
          <span className="m-0"><a href="https://bmw-foundation.org/privacy-policy/" target="_blank" rel="noopener noreferrer" className="pretty-link text-white">Legal notice</a></span>
          <span className="m-0"><a href="https://bmw-foundation.org/privacy-policy/" target="_blank" rel="noopener noreferrer" className="pretty-link text-white">Privacy Policy</a></span>
        </div>
      </Container>
    </div>
  </footer>
)

export default Footer;
