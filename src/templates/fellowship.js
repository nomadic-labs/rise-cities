import React, { useEffect } from "react";
import { graphql } from "gatsby";
import Helmet from "react-helmet";
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import AOS from 'aos';
import LazyLoad from 'react-lazyload';
import ParticipantGallery from "../components/common/ParticipantGallery"
import MultidayAgenda from "../components/common/MultidayAgenda"
import Faqs from "../components/common/Faqs"

import { useDispatch, useSelector } from "react-redux";
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

  /*
  const onSave = id => content => {
    dispatch(updatePageContent(id, content));
  };

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

      I am here!


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
