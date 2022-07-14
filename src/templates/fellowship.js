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


class FellowshipPage extends React.Component {
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

        I am here!


      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FellowshipPage);

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
