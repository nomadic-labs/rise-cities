import React from "react";
import { Link } from "gatsby";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Layout from "../layouts/default.js";
import "../assets/sass/registration.scss";

const RegistrationCompletePage = ({ location }) => {

  return (
    <Layout theme="white" location={location} className="registration-page">
      <section id="registration-form" data-aos="fade-up" data-aos-delay="500" className="mt-15 pt-15 pb-15">
        <Container maxWidth="lg">
          <Grid container justify="center">
            <Grid item xs={12} md={8} lg={7}>
              <div className="form-bg position-relative">
                <div className="form-container p-5 mb-10 mt-10">
                  <h1 className="text-black mb-5">You're in!</h1>
                  <p className="text-large">
                    Thank you for registering. We will be in touch soon by email with more details about the upcoming event.
                  </p>
                  <p><Link to={'/sharons-test-event'}>Back to the event page</Link></p>
                </div>
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>
    </Layout>
  );
}

export default RegistrationCompletePage;
