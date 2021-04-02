import React from "react";
import { graphql } from "gatsby";
import { connect } from "react-redux";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import {
  EditableText,
  EditableParagraph,
  EditableBackgroundImage,
  EditableEmbeddedIframe,
  EditableImageUpload,
  EditableLink
} from "react-easy-editables";

import {
  updatePageContent,
  loadPageData,
} from "../redux/actions";

import { uploadImage } from '../firebase/operations';

import Layout from "../layouts/default.js";
import Section from "../components/common/Section"
import ProgramElements from "../components/common/ProgramElements"
import ParticipantGallery from "../components/common/ParticipantGallery"
import PartnerGallery from "../components/common/PartnerGallery"

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
    console.log("saving content", content)
    this.props.onUpdatePageContent(id, content);
  };


  render() {
    const content = this.props.pageData ? this.props.pageData.content : JSON.parse(this.props.data.pages.content);

    return (
      <Layout theme="white" location={this.props.location}>
        <div className="" />
        <section id="landing" data-aos="fade-up" className="">
          <Container>
          <Grid container>
            <Grid item md={6}>
              <div className="landing-body">
                <div className="">
                  <h1 className="text-black">
                    <EditableText content={content["landing-title"]} onSave={this.onSave("landing-title")} />
                  </h1>
                  <div className="font-size-h4 mb-4">
                    <EditableText content={content["landing-subtitle"]} onSave={this.onSave("landing-subtitle")} />
                  </div>
                  <div className="">
                    <EditableLink classes="btn" content={content["landing-link"]} onSave={this.onSave("landing-link")} />
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
          </Container>
        </section>

        <Container><div className="fancy-border" /></Container>

        <section className="mt-10 mb-10" data-aos="fade-up">
          <Container>
            <h2 className="text-black">
              <EditableText content={content["featured-content-title"]} onSave={this.onSave("featured-content-title")} />
            </h2>

            <div className="">
              <EditableLink classes="btn" content={content["featured-content-link"]} onSave={this.onSave("featured-content-link")} />
            </div>
          </Container>
        </section>

        <Container><div className="fancy-border" /></Container>

        <section className="mt-10 mb-10" data-aos="fade-up">
          <Container>
            <h2 className="text-black">
              <EditableText content={content["program-title"]} onSave={this.onSave("program-title")} />
            </h2>

            <Grid container spacing={8}>
              <Grid item md={6}>
                <div className="font-size-h4 mb-4 text-bold">
                  <EditableText content={content["program-subtitle"]} onSave={this.onSave("program-subtitle")} />
                </div>
              </Grid>

              <Grid item md={6}>
                <div className="mb-4">
                  <EditableParagraph content={content["program-description"]} onSave={this.onSave("program-description")} />
                </div>
              </Grid>
            </Grid>

            <Grid container justify={'flex-end'} spacing={8}>
              <Grid item md={6}>
                <div className="metric">
                  <h3 className="font-size-h2 mt-2 mb-1">
                    <span className="text-green-gradient">
                    <EditableText content={content["metrics1-title"]} onSave={this.onSave("metrics1-title")} />
                    </span>
                  </h3>
                  <div className="text-bold mb-5">
                    <EditableText content={content["metrics1-subtitle"]} onSave={this.onSave("metrics1-subtitle")} />
                  </div>
                </div>
                <EditableParagraph content={content["metrics1-description"]} onSave={this.onSave("metrics1-description")} />
              </Grid>

              <Grid item md={6}>
                <div className="metric">
                 <h3 className="font-size-h2 mt-2 mb-1">
                    <span className="text-green-gradient">
                    <EditableText content={content["metrics2-title"]} onSave={this.onSave("metrics2-title")} />
                    </span>
                  </h3>
                  <div className="text-bold mb-5">
                    <EditableText content={content["metrics2-subtitle"]} onSave={this.onSave("metrics2-subtitle")} />
                  </div>
                </div>
                <EditableParagraph content={content["metrics2-description"]} onSave={this.onSave("metrics2-description")} />
              </Grid>
            </Grid>

          </Container>
        </section>

        <Container><div className="fancy-border" /></Container>

        <section className="mt-10 mb-10" data-aos="fade-up">
          <Container>
            <h2 className="text-black">
              <EditableText content={content["labs-title"]} onSave={this.onSave("labs-title")} />
            </h2>
            <Grid container justify={'flex-end'}>
              <Grid item md={4}>
                Engage > Engineer > Activate
              </Grid>

              <Grid item md={8}>
                <div className="labs-item display-flex">
                  <div><EditableText content={content["engage-title"]} onSave={this.onSave("engage-title")} /></div>
                  <div><ArrowForwardIcon /></div>
                  <EditableParagraph content={content["engage-description"]} onSave={this.onSave("engage-description")} />
                </div>

                <div className="labs-item display-flex">
                  <div><EditableText content={content["engineer-title"]} onSave={this.onSave("engineer-title")} /></div>
                  <div><ArrowForwardIcon /></div>
                  <EditableParagraph content={content["engineer-description"]} onSave={this.onSave("engineer-description")} />
                </div>

                <div className="labs-item display-flex">
                  <div><EditableText content={content["activate-title"]} onSave={this.onSave("activate-title")} /></div>
                  <div><ArrowForwardIcon /></div>
                  <EditableParagraph content={content["activate-description"]} onSave={this.onSave("activate-description")} />
                </div>
              </Grid>
            </Grid>
          </Container>
        </section>

        <section className="mt-10 mb-10" data-aos="fade-up">
          <Container>
            <h2 className="text-black">
              <EditableText content={content["events-title"]} onSave={this.onSave("events-title")} />
            </h2>

            <ProgramElements />
          </Container>
        </section>

        <section className="mt-10 mb-10" data-aos="fade-up">
          <Container>
            <h2 className="text-black">
              <EditableText content={content["participants-title"]} onSave={this.onSave("participants-title")} />
            </h2>

            <ParticipantGallery content={content["participants-collection"]} onSave={this.onSave("participants-collection")} />
          </Container>
        </section>

        <section className="mt-10 mb-10" data-aos="fade-up">
          <Container>
            <h2 className="text-black">
              <EditableText content={content["partners-title"]} onSave={this.onSave("partners-title")} />
            </h2>

            <PartnerGallery content={content["partners-collection"]} onSave={this.onSave("partners-collection")} />
          </Container>
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


