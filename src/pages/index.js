import React from "react";
import { graphql, Link } from "gatsby";
import { connect } from "react-redux";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import LazyLoad from 'react-lazyload';

import { Carousel } from 'react-responsive-carousel';

import {
  EditableText,
  EditableParagraph,
  EditableImageUpload,
} from "react-easy-editables";

import {
  updatePageContent,
  loadPageData,
  toggleNewPageModal
} from "../redux/actions";

import { uploadFile as uploadImage } from '../aws/operations';

import Layout from "../layouts/default.js";
import ParticipantGallery from "../components/common/ParticipantGallery"
import PartnerGallery from "../components/common/PartnerGallery"
import EventGallery from "../components/common/EventGallery"
import FeaturedContent from "../components/common/FeaturedContent"

import resilientIcon from "../assets/images/icons/resilient-icon-32px.svg"
import intelligentIcon from "../assets/images/icons/digital-icon-32px.svg"
import sustainableIcon from "../assets/images/icons/sustainable-icon-32px.svg"
import equitableIcon from "../assets/images/icons/inclusive-icon-32px.svg"
import globalIcon from "../assets/images/icons/global-icon-32px.svg"
import localIcon from "../assets/images/icons/neighbourhood-icon-32px.svg"

import "react-responsive-carousel/lib/styles/carousel.min.css";

const mapDispatchToProps = dispatch => {
  return {
    onUpdatePageContent: (id, data) => {
      dispatch(updatePageContent(id, data));
    },
    onLoadPageData: data => {
      dispatch(loadPageData(data));
    },
    toggleNewPageModal: () => {
      dispatch(toggleNewPageModal());
    },
  };
};

const mapStateToProps = state => {
  return {
    pageData: state.page.data,
    isLoggedIn: state.adminTools.isLoggedIn,
    isEditingPage: state.adminTools.isEditingPage,
  };
};

// const isClient = typeof window !== 'undefined';

class HomePage extends React.Component {

  constructor(props) {
    super(props)
    const initialPageData = {
      ...this.props.data.pages,
      content: JSON.parse(this.props.data.pages.content)
    };
    this.props.onLoadPageData(initialPageData);
    this.state = {
      selectedItem: 0
    }
  }

  onSave = id => content => {
    this.props.onUpdatePageContent(id, content);
  };

  render() {
    const content = this.props.pageData ? this.props.pageData.content : JSON.parse(this.props.data.pages.content);
    const sliderSettings = {
      emulateTouch: true,
      swipeable: true,
      useKeyboardArrows: true,
      infiniteLoop: true,
      showStatus: false,
      showThumbs: false,
      selectedItem: this.state.selectedItem,
      onChange: (i) => this.setState({ selectedItem: i }),
      renderIndicator: ( clickHandler, isSelected, index, label ) => (
        <li
          role="button"
          aria-label={`Slide number ${index + 1}`}
          className={`dot ${isSelected ? 'selected' : ''}`}
          onClick={clickHandler}
          onKeyDown={e => {
            if (e.key === "Enter") {
              clickHandler()
            }
          }}
          tabIndex={0}
        >
          {`${index + 1}`}
        </li>
      )
    };

    return (
      <Layout theme="white" location={this.props.location}>
        <section id="landing" data-aos="fade-up" data-aos-delay="500" className="pt-15 pb-15">
          <Carousel {...sliderSettings}>
            <div className="landing-slide">
              <Container>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <div className="landing-body">
                      <div className="landing-intro">
                          <h1 className="text-black pb-8">
                            <span className="no-wrap"><img className="title-icon" src={localIcon} alt="" />{`Local`}</span>
                            <span>{` Solutions for `}</span>
                            <span className="no-wrap"><img className="title-icon" src={globalIcon} alt="" />{`Global`}</span>
                            <span>{` Challenges`}</span>
                          </h1>

                        <div className="font-size-h4 mb-8">
                          <EditableText content={content["landing-subtitle"]} onSave={this.onSave("landing-subtitle")} />
                        </div>
                        <div className="">
                          <button className="btn" aria-label="Next slide" onClick={() => this.setState({ selectedItem: 1 })}>
                            <span className="mr-1">What is RISE Cities?</span>
                            <ArrowForwardIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div data-aos="fade-up" data-aos-delay="750" className="landing-image">
                      <EditableImageUpload
                        content={content["landing-image"]}
                        onSave={this.onSave("landing-image")}
                        uploadImage={uploadImage}
                        classes="slide-img"
                        styles={{ image: { objectFit: 'cover' }}}
                      />
                    </div>
                  </Grid>
                </Grid>
              </Container>
            </div>

            <div className="landing-slide">
              <Container>
                <Grid container spacing={6}>
                  <Grid item sm={6}>
                    <div className="landing-body">
                      <h2 className="text-black">
                        <EditableText content={content["resilient-title"]} onSave={this.onSave("resilient-title")} />
                      </h2>
                      <div className="font-size-h4 mb-8 mr-4">
                        <EditableText content={content["resilient-subtitle"]} onSave={this.onSave("resilient-subtitle")} />
                      </div>
                    </div>
                  </Grid>
                  <Grid item sm={6}>
                      <div className="landing-image">
                        <EditableImageUpload
                          content={content["resilient-image"]}
                          onSave={this.onSave("resilient-image")}
                          uploadImage={uploadImage}
                          classes="slide-img"
                          styles={{ image: { objectFit: 'cover' }}}
                        />
                        <div className="rise-icon" aria-label="Next slide">
                          <img src={resilientIcon} alt="" />
                        </div>
                      </div>
                  </Grid>
                </Grid>
              </Container>
            </div>

            <div className="landing-slide">
              <Container>
                <Grid container spacing={6}>
                  <Grid item sm={6}>
                    <div className="landing-body">
                      <h2 className="text-black">
                        <EditableText content={content["intelligent-title"]} onSave={this.onSave("intelligent-title")} />
                      </h2>
                      <div className="font-size-h4 mb-8 mr-4">
                        <EditableText content={content["intelligent-subtitle"]} onSave={this.onSave("intelligent-subtitle")} />
                      </div>
                    </div>
                  </Grid>
                  <Grid item sm={6}>
                    <div className="landing-image">
                      <EditableImageUpload
                        content={content["intelligent-image"]}
                        onSave={this.onSave("intelligent-image")}
                        uploadImage={uploadImage}
                        classes="slide-img"
                        styles={{ image: { objectFit: 'cover' }}}
                      />
                      <div className="rise-icon" aria-label="Next slide">
                        <img src={intelligentIcon} alt="" />
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Container>
            </div>

            <div className="landing-slide">
              <Container>
                <Grid container spacing={6}>
                  <Grid item sm={6}>
                    <div className="landing-body">
                      <h2 className="text-black">
                        <EditableText content={content["sustainable-title"]} onSave={this.onSave("sustainable-title")} />
                      </h2>
                      <div className="font-size-h4 mb-8 mr-4">
                        <EditableText content={content["sustainable-subtitle"]} onSave={this.onSave("sustainable-subtitle")} />
                      </div>
                    </div>
                  </Grid>
                  <Grid item sm={6}>
                    <div className="landing-image">
                      <EditableImageUpload
                        content={content["sustainable-image"]}
                        onSave={this.onSave("sustainable-image")}
                        uploadImage={uploadImage}
                        classes="slide-img"
                        styles={{ image: { objectFit: 'cover' }}}
                      />
                      <div className="rise-icon" aria-label="Next slide">
                        <img src={sustainableIcon} alt="" />
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Container>
            </div>

            <div className="landing-slide">
              <Container>
                <Grid container spacing={6}>
                  <Grid item sm={6}>
                    <div className="landing-body">
                      <h2 className="text-black">
                        <EditableText content={content["equitable-title"]} onSave={this.onSave("equitable-title")} />
                      </h2>
                      <div className="font-size-h4 mb-8 mr-4">
                        <EditableText content={content["equitable-subtitle"]} onSave={this.onSave("equitable-subtitle")} />
                      </div>
                    </div>
                  </Grid>
                  <Grid item sm={6}>
                    <div className="landing-image">
                      <EditableImageUpload
                        content={content["equitable-image"]}
                        onSave={this.onSave("equitable-image")}
                        uploadImage={uploadImage}
                        classes="slide-img"
                        styles={{ image: { objectFit: 'cover' }}}
                      />
                      <div className="rise-icon" aria-label="Next slide">
                        <img src={equitableIcon} alt="" />
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Container>
            </div>
          </Carousel>
        </section>

        <Container><div className="fancy-border" data-aos="flip-right" /></Container>

        <section className="mt-10 mb-10" data-aos="fade-up" id="program">
          <Container>
            <h2 className="text-black">
              <EditableText content={content["program-title"]} onSave={this.onSave("program-title")} />
            </h2>

            <Grid container spacing={6}>
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

            <Grid container justify={'flex-end'} spacing={6}>
              <Grid item md={6}>
                <div className="metric">
                  <h3 className="font-size-h2 mt-2 mb-1">
                    <span className="text-gradient">
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
                    <span className="text-gradient">
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

        <Container><div className="fancy-border" data-aos="flip-right" data-aos-offset="100" /></Container>

        <section className="mt-10 mb-10" data-aos="fade-up" id="rise-city-lab">
          <Container style={{ overflow: 'hidden' }}>
            <div className="rise-lab position-relative">

              <Grid container spacing={6}>
                <Grid item xs={12} md={7} lg={8}>
                  <div className="rise-lab-graphic">
                    <EditableImageUpload 
                      content={content["rise-city-lab-image"]}
                      onSave={this.onSave("rise-city-lab-image")}
                      uploadImage={uploadImage}
                      classes="slide-img"
                      styles={{ image: {objectFit: 'cover' }}}
                    />
                  </div>
                  <h2 className="text-black">
                    <EditableText content={content["labs-title"]} onSave={this.onSave("labs-title")} />
                  </h2>
                  <EditableParagraph content={content["labs-intro"]} onSave={this.onSave("labs-intro")} />

                  <div className="pt-2 pb-2">
                    <Link className="btn" to={this.props.data.fellowship.slug}>Learn more</Link>
                  </div>
                </Grid>
              </Grid>

              <Grid container spacing={6} id="stagger">
                <Grid item md={4}>
                  <div className="labs-item" data-aos="fade-up">
                    <h3 className="text-uppercase mb-2 mt-0"><EditableText content={content["engage-title"]} onSave={this.onSave("engage-title")} /></h3>
                    <div className="mb-8 text-bold"><EditableText content={content["engage-subtitle"]} onSave={this.onSave("engage-subtitle")} /></div>
                    <EditableParagraph content={content["engage-description"]} onSave={this.onSave("engage-description")} />
                  </div>
                </Grid>

                <Grid item md={4}>
                  <div className="labs-item" data-aos="fade-up">
                    <h3 className="text-uppercase mb-2 mt-0"><EditableText content={content["engineer-title"]} onSave={this.onSave("engineer-title")} /></h3>
                    <div className="mb-8 text-bold"><EditableText content={content["engineer-subtitle"]} onSave={this.onSave("engineer-subtitle")} /></div>
                    <EditableParagraph content={content["engineer-description"]} onSave={this.onSave("engineer-description")} />
                  </div>
                </Grid>

                <Grid item md={4}>
                  <div className="labs-item" data-aos="fade-up">
                    <h3 className="text-uppercase mb-2 mt-0"><EditableText content={content["activate-title"]} onSave={this.onSave("activate-title")} /></h3>
                    <div className="mb-8 text-bold"><EditableText content={content["activate-subtitle"]} onSave={this.onSave("activate-subtitle")} /></div>
                    <EditableParagraph content={content["activate-description"]} onSave={this.onSave("activate-description")} />
                  </div>
                </Grid>
              </Grid>
            </div>
          </Container>
        </section>

        <Container><div className="fancy-border" data-aos="flip-right" data-aos-offset="100" /></Container>

        <section className="mt-10 mb-10" data-aos="fade-up" id="featured">
          <Container>
            <h2 className="text-black">
              <EditableText content={content["featured-content-title"]} onSave={this.onSave("featured-content-title")} />
            </h2>
            {
              this.props.isEditingPage &&
              <div className="row mt-6 mb-4">
                <div className="col-12">
                  <Button
                    onClick={this.props.toggleNewPageModal}
                    color="default"
                    variant="contained">
                    Add new page
                  </Button>
                </div>
              </div>
            }
            <FeaturedContent />

            <div className="">
              <Link className="btn" to='/articles'>Explore more content</Link>
            </div>
          </Container>
        </section>

        <Container><div className="fancy-border" data-aos="flip-right" data-aos-offset="100" /></Container>

        <section className="mt-10 mb-10" data-aos="fade-up" id="events">
          <Container>
            <h2 className="text-black">
              <EditableText content={content["events-title"]} onSave={this.onSave("events-title")} />
            </h2>

            <EventGallery content={content["events-collection"]} onSave={this.onSave("events-collection")} />
          </Container>
        </section>

        <Container><div className="fancy-border" data-aos="flip-right" data-aos-offset="100" /></Container>

        <section className="mt-10 mb-15" data-aos="fade-up" id="people">
          <Container>
            <h2 className="text-black">
              <EditableText content={content["participants-title"]} onSave={this.onSave("participants-title")} />
            </h2>

            <LazyLoad offset={200}>
              <ParticipantGallery content={content["participants-collection"]} onSave={this.onSave("participants-collection")} />
            </LazyLoad>
          </Container>
        </section>

        <Container><div className="fancy-border" data-aos="flip-right" data-aos-offset="100" /></Container>

        <section className="mt-10 mb-10" data-aos="fade-up" id="partners">
          <Container>
            <h2 className="text-black">
              <EditableText content={content["partners-title"]} onSave={this.onSave("partners-title")} />
            </h2>

            <LazyLoad offset={200}>
              <PartnerGallery content={content["partners-collection"]} onSave={this.onSave("partners-collection")} />
            </LazyLoad>
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
    fellowship: pages(id: { eq:"fellowship" }) {
      slug
    }
  }
`;


