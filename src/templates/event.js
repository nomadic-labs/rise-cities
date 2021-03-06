import React from "react";
import { graphql } from "gatsby";
import Helmet from "react-helmet";
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import AOS from 'aos';
import LazyLoad from 'react-lazyload';
import ParticipantGallery from "../components/common/ParticipantGallery"
import MultidayAgenda from "../components/common/MultidayAgenda"
import Faqs from "../components/common/Faqs"

import { connect } from "react-redux";
import {
  EditableParagraph,
  EditableText,
  EditableEmbeddedIframe,
  EditableLink,
  EditableBackgroundImage,
} from "react-easy-editables";
import { uploadFile } from "../aws/operations";

import {
  updatePageContent,
  loadPageData,
  updateTitle,
} from "../redux/actions";

import Layout from "../layouts/default.js";
import "../assets/sass/events.scss";

const mapDispatchToProps = dispatch => {
  return {
    onUpdatePageContent: (id, data) => {
      dispatch(updatePageContent(id, data));
    },
    onLoadPageData: data => {
      dispatch(loadPageData(data));
    },
    onUpdateTitle: title => {
      dispatch(updateTitle(title));
    }
  };
};

const mapStateToProps = state => {
  return {
    pageData: state.page.data,
    pages: state.pages.pages,
    isEditingPage: state.adminTools.isEditingPage,
  };
};


class EventPage extends React.Component {
  constructor(props) {
    super(props)
    const initialPageData = {
      ...this.props.data.pages,
      content: JSON.parse(this.props.data.pages.content)
    };

    this.props.onLoadPageData(initialPageData);
    this.state = {
      selectedProfile: null
    }
  }

  componentDidMount() {
    AOS.init({ delay: 50, duration: 400 })
  }

  onSave = id => content => {
    this.props.onUpdatePageContent(id, content);
  };

  onUpdateTitle = content => {
    this.props.onUpdateTitle(content.text)
  }

  onUpdateHeaderImage = content => {
    const headerObj = { imageSrc: content.imageSrc, title: content.title }
    this.props.onUpdatePageContent('headerImage', headerObj);
  }

  onDeleteHeaderImage = () => {
    this.props.onUpdatePageContent('headerImage', null);
  }

  selectSpeaker = speakerName => {
    if (!speakerName) {
      this.setState({ selectedProfile: null })
    }
    const speakerObj = this.props.pageData.content["participants-collection"]
    const speakerKeys = Object.keys(speakerObj)
    const speakersArr = speakerKeys.map(key => speakerObj[key])
    const speaker = speakersArr.find(s => s.name === speakerName)

    if (speaker) {
      this.setState({ selectedProfile: speaker })
    }
  }

  render() {
    const pageData = this.props.pageData ? this.props.pageData : this.props.data.pages;
    const content = this.props.pageData ? this.props.pageData.content : JSON.parse(this.props.data.pages.content);
    const speakerObj = content["participants-collection"] || {}
    const speakerKeys = Object.keys(speakerObj)
    const itemsToShow = speakerKeys.length
    const speakersArr = speakerKeys.map(key => speakerObj[key])

    return (
      <Layout location={this.props.location}>
        <Helmet>
          <title>{pageData.title}</title>
          <meta description={pageData.description} />
        </Helmet>

        <EditableBackgroundImage
          styles={{ backgroundColor: "rgba(0,0,0,0.9)" }}
          onSave={ this.onUpdateHeaderImage }
          onDelete={ this.onDeleteHeaderImage }
          uploadImage={ uploadFile }
          content={ content.headerImage }
          maxSize={1024 * 1024 * 12}
        >
        <section id="event-landing" data-aos="fade-up" data-aos-offset="100" className="pt-15 pb-15 mt-15">
          <Container>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={8} md={7} lg={6}>
                <div className="header pt-5 pb-5 pr-5 pl-5 bg-white text-black">
                  <h1 className="mt-0 mb-5">
                    {pageData.title}
                  </h1>
                  <div className="text-small text-uppercase text-bold mb-1">
                    <EditableText content={content["event-date"]} onSave={this.onSave("event-date")} />
                  </div>
                  <div className="text-xs text-uppercase text-muted mb-1">
                    <EditableText content={content["event-location"]} onSave={this.onSave("event-location")} />
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid container justify="flex-end">
              <Grid item xs={12} sm={9} md={8} lg={7}>
                <div className="event-info position-relative mt-15">
                  <div className="mb-5 bg-white p-8">
                    <EditableParagraph
                      classes="event-description"
                      content={content["event-description"]}
                      onSave={this.onSave("event-description")}
                    />
                  </div>
                  <div className="rise-circle bg-gradient rotate-slow" />
                </div>
              </Grid>
            </Grid>
          </Container>
        </section>
        </EditableBackgroundImage>

        {
          pageData.registration && (
          <section className="pt-10 pb-15 bg-black text-white" data-aos="fade-up" id="registration">
            <Container>
              <center>
                <h2 className="text-black mb-4 text-white">
                  <EditableText content={content["register-title"]} onSave={this.onSave("register-title")} />
                </h2>
                <EditableParagraph
                  classes="mb-5 text-bold text-large"
                  content={content["register-description"]}
                  onSave={this.onSave("register-description")}
                />
                <EditableLink
                  classes="btn mt-4 text-bold"
                  content={content["registration-link"]}
                  onSave={this.onSave("registration-link")}
                />
              </center>
            </Container>
          </section>
          )
        }

        <section className="mt-10 mb-15" data-aos="fade-up" id="people">
          <Container>
            <h2 className="text-black">
              <EditableText content={content["agenda-title"]} onSave={this.onSave("agenda-title")} />
            </h2>

            <MultidayAgenda
              content={content["agenda-collection"]}
              onSave={this.onSave("agenda-collection")}
              speakersArr={speakersArr}
              selectSpeaker={this.selectSpeaker}
            />

          </Container>
        </section>

        <Container><div className="fancy-border" data-aos="flip-right" /></Container>

        <section className="mt-10 mb-15" data-aos="fade-up" id="people">
          <Container>
            <h2 className="text-black">
              <EditableText content={content["participants-title"]} onSave={this.onSave("participants-title")} />
            </h2>

            <ParticipantGallery
              content={content["participants-collection"]}
              onSave={this.onSave("participants-collection")}
              itemsToShow={itemsToShow}
              selectedProfile={this.state.selectedProfile}
              selectSpeaker={this.selectSpeaker}
            />
          </Container>
        </section>

        {pageData.livestream &&
        <section className="pt-10 pb-15 bg-black text-white" data-aos="fade-up" id="livestream">
          <Container>
            <h2 className="text-white">
              <EditableText content={content["livestream-title"]} onSave={this.onSave("livestream-title")} />
            </h2>

            <LazyLoad offset={200}>
              <EditableEmbeddedIframe content={content["livestream-embed"]} onSave={this.onSave("livestream-embed")} />
            </LazyLoad>
          </Container>
        </section>
        }

        <Container><div className="fancy-border" data-aos="flip-right" /></Container>

        <section className="mt-10 mb-15" data-aos="fade-up" id="people">
          <Container>
            <h2 className="text-black">
              <EditableText content={content["faq-title"]} onSave={this.onSave("faq-title")} />
            </h2>

            <Faqs
              content={content["faqs-collection"]}
              onSave={this.onSave("faqs-collection")}
            />
          </Container>
        </section>

      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPage);

export const query = graphql`
  query EventPageQuery($slug: String!) {
    pages(slug: { eq: $slug }) {
      id
      title
      description
      author
      date
      content
      slug
      category
      next
      head
      template
      registration
      livestream
    }
  }
`;
