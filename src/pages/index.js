import React from "react";
import { graphql } from "gatsby";
import { connect } from "react-redux";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Slider from "react-slick";

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

import resilientIcon from "../assets/images/icons/resilient-icon-32px.svg"
import intelligentIcon from "../assets/images/icons/digital-icon-32px.svg"
import sustainableIcon from "../assets/images/icons/sustainable-icon-32px.svg"
import equitableIcon from "../assets/images/icons/inclusive-icon-32px.svg"
import globalIcon from "../assets/images/icons/global-icon-32px.svg"
import localIcon from "../assets/images/icons/neighbourhood-icon-32px.svg"

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

const sliderSettings = {
  infinite: true,
  speed: 350,
  autoplay: false,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  dots: true,
  appendDots: dots => (
    <div
      style={{
        backgroundColor: "transparent",
        padding: "10px",
        height: '100%',
        width: 'unset',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        right: 0,
        marginRight: '20px',
      }}
    >
      <ul
        style={{
          margin: "0px",
          padding: "0px",
          display: 'flex',
          flexDirection: 'column',
        }}> {dots} </ul>
    </div>
  ),
  customPaging: i => (
    <div
      style={{
        width: "30px",
        color: "inherit",
        padding: "4px 8px",
        fontSize: '14px'
      }}
    >
      {i + 1}
    </div>
  )
};

class HomePage extends React.Component {

  constructor(props) {
    super(props)
    const initialPageData = {
      ...this.props.data.pages,
      content: JSON.parse(this.props.data.pages.content)
    };

    this.props.onLoadPageData(initialPageData);
    this.slider = React.createRef()
  }

  onSave = id => content => {
    console.log("saving content", content)
    this.props.onUpdatePageContent(id, content);
  };

  play = () => {
    console.log("this.slider", this.slider)
    this.slider.current.slickNext();
  }

  render() {
    const content = this.props.pageData ? this.props.pageData.content : JSON.parse(this.props.data.pages.content);

    return (
      <Layout theme="white" location={this.props.location}>
        <div className="" />
        <section id="landing" data-aos="fade-up" data-aos-delay="500" className="pt-15 pb-15">
          <Slider ref={this.slider} {...sliderSettings}>
            <div className="landing-slide">
              <Container>
                <Grid container spacing={8}>
                  <Grid item md={6}>
                    <div className="landing-body">
                      <div className="">
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
                          <button className="btn" onClick={this.play}>
                            <span className="mr-1">What is RISE Cities?</span>
                            <ArrowForwardIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div data-aos="fade-up" data-aos-delay="750">
                      <EditableImageUpload
                        content={content["landing-image"]}
                        onSave={this.onSave("landing-image")}
                        uploadImage={uploadImage}
                      />
                    </div>
                  </Grid>
                </Grid>
              </Container>
            </div>

            <div className="landing-slide">
              <Container>
                <Grid container spacing={8}>
                  <Grid item md={6}>
                    <div className="landing-body">
                      <h2 className="text-black">
                        <EditableText content={content["resilient-title"]} onSave={this.onSave("resilient-title")} />
                      </h2>
                      <div className="font-size-h4 mb-4">
                        <EditableText content={content["resilient-subtitle"]} onSave={this.onSave("resilient-subtitle")} />
                      </div>
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div className="landing-image">
                      <EditableImageUpload
                        content={content["resilient-image"]}
                        onSave={this.onSave("resilient-image")}
                        uploadImage={uploadImage}
                      />
                      <div className="rise-icon">
                        <img src={resilientIcon} alt="" />
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Container>
            </div>

            <div className="landing-slide">
              <Container>
                <Grid container spacing={8}>
                  <Grid item md={6}>
                    <div className="landing-body">
                      <h2 className="text-black">
                        <EditableText content={content["intelligent-title"]} onSave={this.onSave("intelligent-title")} />
                      </h2>
                      <div className="font-size-h4 mb-4">
                        <EditableText content={content["intelligent-subtitle"]} onSave={this.onSave("intelligent-subtitle")} />
                      </div>
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div className="landing-image">
                      <EditableImageUpload
                        content={content["intelligent-image"]}
                        onSave={this.onSave("intelligent-image")}
                        uploadImage={uploadImage}
                      />
                      <div className="rise-icon">
                        <img src={intelligentIcon} alt="" />
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Container>
            </div>

            <div className="landing-slide">
              <Container>
                <Grid container spacing={8}>
                  <Grid item md={6}>
                    <div className="landing-body">
                      <h2 className="text-black">
                        <EditableText content={content["sustainable-title"]} onSave={this.onSave("sustainable-title")} />
                      </h2>
                      <div className="font-size-h4 mb-4">
                        <EditableText content={content["sustainable-subtitle"]} onSave={this.onSave("sustainable-subtitle")} />
                      </div>
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div className="landing-image">
                      <EditableImageUpload
                        content={content["sustainable-image"]}
                        onSave={this.onSave("sustainable-image")}
                        uploadImage={uploadImage}
                      />
                      <div className="rise-icon">
                        <img src={sustainableIcon} alt="" />
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Container>
            </div>

            <div className="landing-slide">
              <Container>
                <Grid container spacing={8}>
                  <Grid item md={6}>
                    <div className="landing-body">
                      <h2 className="text-black">
                        <EditableText content={content["equitable-title"]} onSave={this.onSave("equitable-title")} />
                      </h2>
                      <div className="font-size-h4 mb-4">
                        <EditableText content={content["equitable-subtitle"]} onSave={this.onSave("equitable-subtitle")} />
                      </div>
                    </div>
                  </Grid>
                  <Grid item md={6}>
                    <div className="landing-image">
                      <EditableImageUpload
                        content={content["equitable-image"]}
                        onSave={this.onSave("equitable-image")}
                        uploadImage={uploadImage}
                      />
                      <div className="rise-icon">
                        <img src={equitableIcon} alt="" />
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Container>
            </div>
          </Slider>
        </section>

        <Container><div className="fancy-border" data-aos="flip-right" data-aos-offset="250" /></Container>

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

        <Container><div className="fancy-border" data-aos="flip-right" data-aos-offset="250" /></Container>

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

        <Container><div className="fancy-border" data-aos="flip-right" data-aos-offset="250" /></Container>

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

        <Container><div className="fancy-border" data-aos="flip-right" data-aos-offset="250" /></Container>

        <section className="mt-10 mb-10" data-aos="fade-up">
          <Container>
            <h2 className="text-black">
              <EditableText content={content["events-title"]} onSave={this.onSave("events-title")} />
            </h2>

            <ProgramElements />
          </Container>
        </section>

        <Container><div className="fancy-border" data-aos="flip-right" data-aos-offset="250" /></Container>

        <section className="mt-10 mb-10" data-aos="fade-up">
          <Container>
            <h2 className="text-black">
              <EditableText content={content["participants-title"]} onSave={this.onSave("participants-title")} />
            </h2>

            <ParticipantGallery content={content["participants-collection"]} onSave={this.onSave("participants-collection")} />
          </Container>
        </section>

        <Container><div className="fancy-border" data-aos="flip-right" data-aos-offset="250" /></Container>

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


