import React from "react";
import { graphql } from "gatsby";
import { connect } from "react-redux";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import {
  EditableText,
  EditableParagraph,
  EditableBackgroundImage,
  EditableEmbeddedIframe,
  EditableImageUpload,
} from "react-easy-editables";

import {
  updatePageContent,
  loadPageData,
} from "../redux/actions";

import { uploadImage } from '../firebase/operations';

import Layout from "../layouts/default.js";
import Section from "../components/common/Section"

const mapDispatchToProps = dispatch => {
  return {
    onUpdatePageContent: (id, data) => {
      dispatch(updatePageContent(id, data));
    },
    onLoadPageData: data => {
      dispatch(loadPageData(data));
    },
  };
};

const mapStateToProps = state => {
  return {
    pageData: state.page.data,
    isLoggedIn: state.adminTools.isLoggedIn,
  };
};

const isClient = typeof window !== 'undefined';

class HomePage extends React.Component {

  constructor(props) {
    super(props)
    const initialPageData = {
      ...this.props.data.pages,
      content: JSON.parse(this.props.data.pages.content)
    };

    this.props.onLoadPageData(initialPageData);
  }

  onSave = id => content => {
    this.props.onUpdatePageContent(id, content);
  };


  render() {
    const content = this.props.pageData ? this.props.pageData.content : JSON.parse(this.props.data.pages.content);

    return (
      <Layout theme="white" location={this.props.location}>
        <div className="" />
        <section id="landing" data-aos="fade-down">
          <Grid container>
            <Grid item md={6}>
              <div className="landing-body">
                <div className="">
                  <h1 className="">
                    <EditableText content={content["landing-title"]} onSave={this.onSave("landing-title")} />
                  </h1>
                  <div className="font-size-h4 mb-4 event-dates">
                    <EditableText content={content["landing-subtitle"]} onSave={this.onSave("landing-subtitle")} />
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item md={6}>
              <EditableImageUpload
                content={content["landing-image"]}
                onSave={this.onSave("landing-image")}
                uploadImage={uploadImage}
              />
            </Grid>
          </Grid>
        </section>
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

export const query = graphql`
  query {
    pages(id: { eq: "home" }) {
      id
      content
      title
      description
      slug
    }
  }
`;


