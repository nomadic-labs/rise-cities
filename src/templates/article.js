import React from "react";
import { graphql } from "gatsby";
import Helmet from "react-helmet";
import Container from "@material-ui/core/Container"
import { findIndex } from "lodash"
import AOS from 'aos';

import { connect } from "react-redux";
import { EditableImageUpload } from "react-easy-editables";
import { uploadFile } from "../aws/operations";

import {
  updatePageContent,
  loadPageData,
  updateTitle,
} from "../redux/actions";

import Layout from "../layouts/default.js";
import DynamicSection from "../components/editing/DynamicSection";
import CourseModule from "../components/common/CourseModule";
import T from "../components/common/Translation"


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
    orderedPages: state.pages.orderedPages,
    pages: state.pages.pages,
    currentLang: state.navigation.currentLang,
    isEditingPage: state.adminTools.isEditingPage,
  };
};


class CourseModulePage extends React.Component {
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
    const sections = content.sections && content.sections.length > 0 ? content.sections : [{ content: [] }];
    const moduleOrder = findIndex(this.props.orderedPages, p => p.id === pageData.id) + 1;
    const nextModule = this.props.pages[pageData.next];

    return (
      <Layout location={this.props.location}>
        <Helmet>
          <title>{pageData.title}</title>
          <meta description={pageData.description} />
        </Helmet>

        <Container maxWidth="md">
          <header className="module-header" data-aos="fade-in">
            <p className="text-muted bold" style={{ marginTop: 0 }}>
              {
                Boolean(moduleOrder) &&
                <span><T id="module" />{` ${moduleOrder}`}</span>
              }
            </p>
            <h1 className="underline">{pageData.title}</h1>
          </header>
          {
            (content.headerImage || this.props.isEditingPage) &&
            <EditableImageUpload
              styles={{ container: {display: 'flex', alignItems: 'flex-start'} }}
              onSave={ this.onUpdateHeaderImage }
              onDelete={ this.onDeleteHeaderImage }
              uploadImage={ uploadFile }
              content={ content.headerImage || { imageSrc: null } }
              maxSize={1024 * 1024 * 12}
            />
          }
        </Container>

        {
          sections.map((section, index) => {
            if (!section || !section.content) {
              return null
            }

            return(
              <DynamicSection
                content={ section.content }
                sectionIndex={index}
                key={index}
                type={ section.type }
              />
            )
          })
        }

        {
          nextModule &&
          <section>
            <Container maxWidth="md" data-aos="fade-in">
              <header className="module-header">
                <h2 className="underline"><T id="next_module" /></h2>
              </header>
              <CourseModule page={nextModule} order={moduleOrder + 1} />
            </Container>
          </section>
        }
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseModulePage);

export const query = graphql`
  query BasicPageQuery($slug: String!) {
    pages(slug: { eq: $slug }) {
      id
      content
      title
      slug
    }
  }
`;
