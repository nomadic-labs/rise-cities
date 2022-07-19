import React, { useEffect } from "react";
import { graphql } from "gatsby";
import Helmet from "react-helmet";
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import AOS from 'aos';
import TandemMap from '../components/common/TandemMap';
import LazyLoad from 'react-lazyload';
import ParticipantGallery from "../components/common/ParticipantGallery"

import { useDispatch, useSelector } from "react-redux";
import {
  EditableParagraph,
  EditableText,
  EditableImageUpload,
} from "react-easy-editables";
import { uploadFile } from "../aws/operations";

import {
  updatePageContent,
  loadPageData,
} from "../redux/actions";

import Layout from "../layouts/default.js";
import "../assets/sass/events.scss";

const FellowshipPage = (props) => {

  const dispatch = useDispatch();

  useEffect(() => {
    const { data: { pages } } = props;
    const initialPageData = {
      ...pages,
      content: JSON.parse(pages.content)
    };
    dispatch(loadPageData(initialPageData));

    AOS.init({ delay: 50, duration: 400 })
  }, []);

  const isEditingPage = useSelector((state) => state.adminTools.isEditingPage);
  const pageData = useSelector((state) => state.page?.data);

  if (!pageData) {
    // first render, we haven't saved it to redux state yet
    return null;
  }

  const { content } = pageData;

  const onSave = id => content => {
    dispatch(updatePageContent(id, content));
  };

  /*
  const onUpdateTitle = content => {
    dispatch(updateTitle(content.text));
  }

  onUpdateHeaderImage = content => {
    const headerObj = { imageSrc: content.imageSrc, title: content.title }
    this.props.onUpdatePageContent('headerImage', headerObj);
  }

  onDeleteHeaderImage = () => {
    this.props.onUpdatePageContent('headerImage', null);
  }
  */

  //const pageData = this.props.pageData ? this.props.pageData : this.props.data.pages;
  //const content = this.props.pageData ? this.props.pageData.content : JSON.parse(this.props.data.pages.content);

  return (
    <Layout location={props.location}>
      <Helmet>
        <title>{pageData.title}</title>
        <meta description={pageData.description} />
      </Helmet>

      <section id="landing" data-aos="fade-up" data-aos-delay="500" className="pt-15 pb-15">
        <Container>
          <Grid container spacing={6}>
            <Grid item md={6}>
              <div className="landing-body">
                <div className="landing-intro">
                  <h1 className="text-black">
                    RISE Cities
                  </h1>
                  <h1 className="text-gradient">
                    Fellowship Program
                  </h1>

                  <div className="font-size-h4 mb-5 mt-5">
                    <EditableParagraph content={content["landing-subtitle"]}
                      onSave={onSave("landing-subtitle")} />
                  </div>

                  <div className="font-size-h4 text-black text-bold">
                    <EditableText content={content["landing-date"]}
                      onSave={onSave("landing-date")} />
                  </div>
                </div>
              </div>
            </Grid>

            <Grid item md={6}>
              <div data-aos="fade-up" data-aos-delay="750" className="landing-image">
                <EditableImageUpload
                  content={content["landing-image"]}
                  onSave={onSave("landing-image")}
                  uploadImage={uploadFile}
                  styles={{ image: { objectFit: 'cover' }}}
                />
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>

      <Container><div className="fancy-border" data-aos="flip-right" /></Container>

      <section id="about" data-aos="fade-up" data-aos-delay="500" className="pt-15 pb-15">
        <Container>
          <Grid container spacing={6}>
            <Grid item md={4}>
              <div data-aos="fade-up">
                <h2 className="text-black">
                  <EditableText content={content["about-title"]}
                    onSave={onSave("about-title")} />
                </h2>
                <EditableParagraph content={content["about-content"]}
                  onSave={onSave("about-content")} />
              </div>
            </Grid>
            <Grid item md={8}>
              <div style={{ marginTop: '120px' }} data-aos="fade-up">
                <Grid container>
                  <Grid item md={6}>
                    <h2 className="text-black mb-1">
                      <EditableText content={content["benefits-title"]}
                        onSave={onSave("benefits-title")} />
                    </h2>
                    <h4 className="text-black">
                      <EditableText content={content["benefits-subtitle"]}
                        onSave={onSave("benefits-subtitle")} />
                    </h4>
                    <EditableParagraph content={content["benefits-content"]}
                      onSave={onSave("benefits-content")} />
                  </Grid>

                  <Grid item md={6}>
                    <EditableImageUpload
                      content={content["about-image"]}
                      onSave={onSave("about-image")}
                      uploadImage={uploadFile}
                      styles={{ image: { objectFit: 'cover' }}}
                    />
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>

      <Container><div className="fancy-border" data-aos="flip-right" /></Container>

      <section data-aos="fade-up" className="pt-15 pb-15">
        <Container>
          Curriculum - TBD
        </Container>
      </section>

      <Container><div className="fancy-border" data-aos="flip-right" /></Container>

      <section data-aos="fade-up" className="pt-15 pb-15">
        <Container>
          Timeline - TBD
        </Container>
      </section>

      <Container><div className="fancy-border" data-aos="flip-right" /></Container>

      <section id="tandems" data-aos="fade-up" className="pt-15 pb-15">
        <Container>
          <h2 className="text-black">
            <EditableText content={content["tandems-title"]}
              onSave={onSave("tandems-title")} />
          </h2>
          <Grid container spacing={6}>
            <Grid item md={6}>
              <EditableParagraph content={content["tandems-description"]}
                onSave={onSave("tandems-description")} />
            </Grid>
            <Grid item md={6}>
              <div className="criteria mb-3">
                <EditableText content={content["eligibility-criteria-title"]}
                  onSave={onSave("eligibility-criteria-title")} />
              </div>
              <EditableParagraph content={content["eligibility-criteria"]}
                onSave={onSave("eligibility-criteria")} />
            </Grid>
          </Grid>

          <div className="mt-10 map-container">
            <TandemMap />
          </div>


        </Container>
      </section>

      <Container><div className="fancy-border" data-aos="flip-right" data-aos-offset="100" /></Container>

      <section className="mt-10 mb-15" data-aos="fade-up" id="people">
        <Container>
          <h2 className="text-black">
            <EditableText content={content["mentors-title"]} 
              onSave={onSave("mentors-title")} />
          </h2>

          <LazyLoad offset={200}>
            <ParticipantGallery 
              content={content["mentors-collection"]} 
              onSave={onSave("mentors-collection")} />
          </LazyLoad>
        </Container>
      </section>

    </Layout>
  );
}

export default FellowshipPage;

export const query = graphql`
  query FellowshipPageQuery($slug: String!) {
    pages(slug: { eq: $slug }) {
      id
      title
      description
      author
      date
      content
      slug
      category
    }
  }
`;
