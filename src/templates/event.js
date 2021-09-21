import React from "react";
import { graphql, Link } from "gatsby";
import Helmet from "react-helmet";
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import AOS from 'aos';
import LazyLoad from 'react-lazyload';
import ParticipantGallery from "../components/common/ParticipantGallery"
import Collection from "../components/common/Collection"
import AgendaList from "../components/common/AgendaList"

import { connect } from "react-redux";
import {
  EditableImageUpload,
  EditableParagraph,
  EditableText,
  EditableEmbeddedIframe,
  EditableLink,
} from "react-easy-editables";
import { uploadFile } from "../aws/operations";

import {
  updatePageContent,
  loadPageData,
  updateTitle,
} from "../redux/actions";

import Layout from "../layouts/default.js";

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

  render() {
    const pageData = this.props.pageData ? this.props.pageData : this.props.data.pages;
    const content = this.props.pageData ? this.props.pageData.content : JSON.parse(this.props.data.pages.content);
    const dateString = pageData.date ? new Date(parseInt(pageData.date)).toDateString() : ""

    return (
      <Layout location={this.props.location}>
        <Helmet>
          <title>{pageData.title}</title>
          <meta description={pageData.description} />
        </Helmet>

        <section id="article-landing" data-aos="fade-up" data-aos-offset="100" className="pt-15 mt-15 mb-8">
          <Container>
            <Grid container spacing={6}>
              <Grid item sm={6}>
                <h1 className="mb-5 text-black">{pageData.title}</h1>
                <div className="mb-5">
                  <p className="text-sm text-uppercase text-bold mb-1">
                    <EditableText content={content["event-date"]} onSave={this.onSave("event-date")} />
                  </p>
                  <p className="text-xs text-uppercase text-muted mb-1">
                    <EditableText content={content["event-location"]} onSave={this.onSave("event-location")} />
                  </p>
                </div>
                <p className="text-large mb-4">{pageData.description}</p>
              </Grid>

              <Grid item sm={6}>
              {
                (content.headerImage || this.props.isEditingPage) &&
                <EditableImageUpload
                  styles={{ container: {display: 'flex', alignItems: 'flex-start'}, image: { maxHeight: '60vh', objectFit: 'cover' } }}
                  onSave={ this.onUpdateHeaderImage }
                  onDelete={ this.onDeleteHeaderImage }
                  uploadImage={ uploadFile }
                  content={ content.headerImage || { imageSrc: null } }
                  maxSize={1024 * 1024 * 12}
                />
              }
              </Grid>
            </Grid>
          </Container>
        </section>


        <section className="pt-10 pb-15 highlight-section bg-black text-white" data-aos="fade-up" id="registration">
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

        <section className="mt-10 mb-15" data-aos="fade-up" id="people">
          <Container>
            <h2 className="text-black">
              <EditableText content={content["agenda-title"]} onSave={this.onSave("agenda-title")} />
            </h2>

            <h3 className="text-black">
              <EditableText content={content["day1-title"]} onSave={this.onSave("day1-title")} />
            </h3>
            <AgendaList content={content["day1-agenda"]} onSave={this.onSave("day1-agenda")} />


             <h3 className="text-black">
              <EditableText content={content["day2-title"]} onSave={this.onSave("day2-title")} />
            </h3>
            <AgendaList content={content["day2-agenda"]} onSave={this.onSave("day2-agenda")} />

          </Container>
        </section>

        <Container><div className="fancy-border" data-aos="flip-right" /></Container>

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
    }
  }
`;
