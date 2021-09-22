import React, { useState, useEffect } from "react";
import { graphql, Link } from "gatsby";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Layout from "../layouts/default.js";
import "../assets/sass/registration.scss";

const RegistrationPage = ({ location }) => {

  return (
    <Layout theme="white" location={location} className="registration-page">
      <section id="registration-form" data-aos="fade-up" data-aos-delay="500" className="mt-15 pt-15 pb-15">
        <Container maxWidth="lg">
          <Grid container>
            <Grid item xs={12}>
              <div className="header pt-15 pb-15">
                <h1 className="text-black mb-5 bg-white display-inline pt-2 pb-2 pl-5 pr-5">Register for the Event</h1>
              </div>
            </Grid>
          </Grid>
          <Grid container justify="flex-end">
            <Grid item xs={12} md={8} lg={7}>
              <div className="form-bg position-relative">
                <div className="form-container p-5 mb-10">
                  <form
                    action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8"
                    method="POST"
                  >

                    <input type="hidden" name="oid" value="00D1t000000FLFh" />
                    <input type="hidden" name="retURL" value="http://somerandomurl.org" />
                    <input type="hidden" name="tbd" value ="tbd" />
                    <input type="hidden" name="tbd" value ="tbd" />


                    <div className="form-control">
                      <label for="salutation">Salutation</label>
                      <select id="salutation" name="salutation" required="">
                        <option value="">--None--</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Mx.">Mx.</option>
                      </select>
                    </div>

                    <div className="form-control">
                      <label for="first_name">First Name</label>
                      <input  id="first_name" maxlength="40" name="first_name" size="20" type="text" required />
                    </div>

                    <div className="form-control">
                      <label for="last_name">Last Name</label>
                      <input  id="last_name" maxlength="80" name="last_name" size="20" type="text" required />
                    </div>

                    <div className="form-control">
                      <label for="email">Email</label>
                      <input  id="email" maxlength="80" name="email" size="20" type="email" required />
                    </div>

                    <div className="form-control">
                      <label for="company">Company</label>
                      <input  id="company" maxlength="40" name="company" size="20" type="text" />
                    </div>

                    <div className="form-control">
                      <label for="tbd">Tbd</label>
                      <input  id="tbd" maxlength="40" name="city" size="20" type="text" />
                    </div>

                    <div className="form-control">
                      <input type="submit" name="submit" className="btn" />
                    </div>

                  </form>
                </div>
                <div className="rise-circle bg-gradient rotate-slow" />
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>
    </Layout>
  );
}

export default RegistrationPage;
