import React from "react";
import { graphql, Link } from "gatsby";
import Helmet from "react-helmet";
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
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
    isEditingPage: state.adminTools.isEditingPage,
  };
};


class ArticlePage extends React.Component {
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
    const nextPage = this.props.pages[pageData.next];
    const dateString = new Date(parseInt(pageData.date)).toDateString()

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
                <div className="display-flex align-center pb-4 mb-4 text-xs"><ArrowBackIcon /><Link to='/articles' className="pretty-link ml-2">Explore more content</Link></div>
                <h1 className="mb-4">{pageData.title}</h1>
                <p className="text-large mb-4">{pageData.description}</p>
                {pageData.author && <p className="text-xs text-uppercase text-dark mb-1">{`By ${pageData.author}`}</p>}
                <p className="text-xs text-uppercase text-muted mb-1">{dateString}</p>
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
          nextPage &&
          <section>
            <Container data-aos="fade-in">
              <Grid container justify="flex-end">
                <Grid item sm={6}>
                  <div className="display-flex align-center pb-4 mb-4 text-large">
                    <Link to={nextPage.slug} className="pretty-link mr-2">{nextPage.title}</Link>
                    <ArrowForwardIcon />
                  </div>
                </Grid>
              </Grid>
            </Container>
          </section>
        }
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticlePage);

export const query = graphql`
  query BasicPageQuery($slug: String!) {
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
      featured
      template
    }
  }
`;
