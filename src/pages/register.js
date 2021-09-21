import React, { useState, useEffect } from "react";
import { graphql, Link } from "gatsby";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Layout from "../layouts/default.js";

const RegistrationPage = ({ location }) => {

  return (
    <Layout theme="white" location={location}>
      <section id="articles" data-aos="fade-up" data-aos-delay="500" className="mt-15 pt-15 pb-15">
        <Container>
          <Grid container spacing={6}>
            <Grid item sm={12}>
              <div className="">
                <h1 className="text-black mb-3">Register for the Event</h1>

                <form action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8" method="POST">

                  <input type="hidden" name="oid" value="00D1t000000FLFh" />
                  <input type="hidden" name="retURL" value="http://somerandomurl.org" />
                  <input type="hidden" name="tbd" value ="tbd" />
                  <input type="hidden" name="tbd" value ="tbd" />


                  <label for="salutation">Salutation</label>
                    <select id="salutation" name="salutation" required="">
                          <option value="">--None--</option>
                          <option value="Ms.">Ms.</option>
                          <option value="Mr.">Mr.</option>
                          <option value="Mx.">Mx.</option>
                    </select>

                  <label for="first_name">First Name</label>
                  <input  id="first_name" maxlength="40" name="first_name" size="20" type="text" /><br/>

                  <label for="last_name">Last Name</label>
                  <input  id="last_name" maxlength="80" name="last_name" size="20" type="text" /><br/>

                  <label for="email">Email</label>
                  <input  id="email" maxlength="80" name="email" size="20" type="text" /><br/>

                  <label for="company">Company</label>
                  <input  id="company" maxlength="40" name="company" size="20" type="text" /><br/>

                  <label for="tbd">Tbd</label>
                  <input  id="tbd" maxlength="40" name="city" size="20" type="text" /><br/>

                  <label for="tbd">Tbd</label>
                  <input  id="tbd" maxlength="40" name="city" size="20" type="text" /><br/>

                  <label for="tbd">Tbd</label>
                  <input  id="tbd" maxlength="40" name="city" size="20" type="text" /><br/>

                  <input type="submit" name="submit" />

                </form>

              </div>
            </Grid>
          </Grid>
        </Container>
      </section>
    </Layout>
  );
}

export default RegistrationPage;
