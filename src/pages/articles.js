import React, { useState, useEffect } from "react";
import { graphql, Link } from "gatsby";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Masonry from 'react-masonry-component'
import LazyLoad from 'react-lazyload';
import { EditableTextArea, EditorWrapper, theme } from "react-easy-editables";

import { useDispatch, useSelector } from 'react-redux';
import { updateFirestoreDoc } from "../redux/actions";

import Layout from "../layouts/default.js";
import ensureAbsoluteUrl from '../utils/ensureAbsoluteUrl';

import allIcon from "../assets/images/icons/all-icon-32px.svg"
import blogIcon from "../assets/images/icons/blogs-icon-32px.svg"
import podcastIcon from "../assets/images/icons/podcast-icon-32px.svg"
import videoIcon from "../assets/images/icons/video-icon-32px.svg"

import produce from 'immer';
import findIndex from 'lodash/findIndex';

import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import { DateTime } from 'luxon';

const DateField = (props) => {
  const { date, onSave } = props;

  const [ isEditingDate, setEditingDate ] = useState(false);

  const dateString = date ? new Date(parseInt(date)).toDateString() : ""
  const dateObj = date ? DateTime.fromMillis(date) : DateTime.now();
  const isEditingPage = useSelector((state) => state.adminTools.isEditingPage);

  const handleChange = (value) => {
    onSave(value.toMillis());
    setEditingDate(false);
  };

  return (
    <>
    { isEditingPage && !isEditingDate &&
      <EditorWrapper theme={theme} startEditing={() => setEditingDate(true)}>
        <p className="text-xs text-uppercase text-muted mb-1">{dateString || 'Edit date'}</p>
      </EditorWrapper>
    }
    { isEditingPage && isEditingDate &&
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <DatePicker 
          value={dateObj} 
          onChange={handleChange} 
          variant="inline" 
          disableToolbar 
          format="yyyy/MM/dd"
        />
      </MuiPickersUtilsProvider>
    }
    { !isEditingPage &&
      <p className="text-xs text-uppercase text-muted mb-1">{dateString}</p>
    }
    </>
  );
};

const ArticleGallery = ({ pages, updatePage }) => {

  const dispatch = useDispatch();

  const saveDescription = (id, content) => {
    const { text: description } = content;

    // update local state
    updatePage(id, 'description', description);

    // save to database
    dispatch(updateFirestoreDoc(id, { description }));
  };

  const saveDate = (id, date) => {
    updatePage(id, 'date', date);
    dispatch(updateFirestoreDoc(id, { date }));
  };

  return (
    <LazyLoad>
      <Masonry className="featured-content-collection" options={{ gutter: 16 }}>
        {
          pages.map(page => {
            const content = JSON.parse(page.content)

            const description = { text: page.description };

            return (
              <div className="featured-content-item mb-10" key={page.id}>
                {content.headerImage &&
                  <img src={content.headerImage.imageSrc} alt="" />
                }
                <p className="mb-1 mt-1 text-xs text-uppercase text-clamped">{page.category}</p>
                {page.externalLink ? (
                  <a href={ensureAbsoluteUrl(page.externalLink)} className="pretty-link" target="_blank" rel="noopener noreferrer">
                    <h3 className="mb-0 mt-0">{page.title}</h3>
                  </a>
                  ) : (
                  <Link to={page.slug} className="pretty-link">
                    <h3 className="mb-0 mt-0">{page.title}</h3>
                  </Link>
                )}
                <DateField 
                  date={page.date} 
                  onSave={(date) => saveDate(page.id, date)}
                />
                <div className="text-xs mt-2">
                  <EditableTextArea
                    content={description}
                    onSave={(content) => saveDescription(page.id, content)} />
                </div>
              </div>
            )
          })
        }
      </Masonry>
    </LazyLoad>
  );
}

const FeaturedContentPage = ({ data, location }) => {
  const allPages = data.allPages.nodes
  const pageOrder = data.allConfig.nodes[0].page_order
  const orderedPages = pageOrder.map(pageId => allPages.find(p => p.id === pageId)).filter(i => i)

  const [pages, setPages] = useState(orderedPages)
  const [filter, setFilter] = useState()

  const updatePage = (pageId, field, value) => {
    setPages(produce(pages, (draft) => {
      const index = findIndex(draft, { id: pageId });
      if (index === -1) return;
      draft[index][field] = value;
    }));
  };

  useEffect(() => {
    if (!filter) {
      return setPages(orderedPages)
    }
    const filtered = orderedPages.filter(page => page.category === filter)
    setPages(filtered)
  }, [filter])

  return (
    <Layout theme="white" location={location}>
      <section id="articles" data-aos="fade-up" data-aos-delay="500" className="mt-15 pt-15 pb-15">
        <Container>
          <Grid container spacing={6}>
            <Grid item sm={12}>
              <div className="">
                <h1 className="text-black mb-3">Explore Content</h1>
                <p>Browse the articles, podcasts, and videos that we've posted.</p>

                <div className="mb-10">
                  <ul className="filter">
                    <li className={!filter ? 'active' : ''}>
                      <button onClick={() => setFilter()} className="pretty-link">
                        <img src={allIcon} alt="All" />
                        All
                      </button>
                    </li>
                    <li className={filter === 'article' ? 'active' : ''}>
                      <button onClick={() => setFilter('article')} className="pretty-link">
                        <img src={blogIcon} alt="Articles" />
                        Articles
                      </button>
                    </li>
                    <li className={filter === 'podcast' ? 'active' : ''}>
                      <button onClick={() => setFilter('podcast')} className="pretty-link">
                        <img src={podcastIcon} alt="Podcasts" />
                        Podcasts
                      </button>
                    </li>
                    <li className={filter === 'video' ? 'active' : ''}>
                      <button onClick={() => setFilter('video')} className="pretty-link">
                        <img src={videoIcon} alt="Videos" />
                        Videos
                      </button>
                    </li>
                  </ul>
                </div>

                <ArticleGallery pages={pages} updatePage={updatePage} />
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>
    </Layout>
  );
}

export default FeaturedContentPage;

export const query = graphql`
  query {
    allPages(filter: {template: {in: ["article.js"]}, deleted: { ne: true } }) {
      nodes {
        id
        title
        description
        slug
        externalLink
        template
        content
        category
        author
        date
        next
        head
        featured
      }
    }
    allConfig {
      nodes {
        page_order
      }
    }
  }
`;



