import React, { useState, useEffect } from "react";
import { graphql, Link } from "gatsby";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { find } from 'lodash'
import Masonry from 'react-masonry-component'


import Layout from "../layouts/default.js";

import allIcon from "../assets/images/icons/all-icon-32px.svg"
import blogIcon from "../assets/images/icons/blogs-icon-32px.svg"
import podcastIcon from "../assets/images/icons/podcast-icon-32px.svg"
import videoIcon from "../assets/images/icons/video-icon-32px.svg"


class ArticleGallery extends React.Component {

  nextPage = page => {
    return find(this.props.pages, p => p.id === page.next);
  }

  prevPage = page => {
    return find(this.props.pages, p => p.next === page.id)
  }

  orderedPages = (page, arr=[]) => {
    if (!page) {
      return arr
    }

    if (arr.includes(page)) {
      return arr
    }

    arr.push(page)

    const nextPage = this.nextPage(page)
    if (page === nextPage) {
      return arr
    }
    return this.orderedPages(this.nextPage(page), arr)
  }

  render() {
    return(
      <Masonry className="featured-content-collection" options={{ gutter: 16 }}>
        {
          this.props.pages.map(page => {
            const content = JSON.parse(page.content)
            return(
              <div className="featured-content-item mb-10" key={page.id}>
                {content.headerImage &&
                  <img src={content.headerImage.imageSrc} alt="" />
                }
                <p className="mb-1 mt-1 text-xs text-uppercase text-clamped">{page.category}</p>
                <Link to={page.slug} className="pretty-link">
                  <h3 className="mb-0 mt-0">{page.title}</h3>
                </Link>
                <p className="text-xs mt-2">{page.description}</p>
              </div>
            )
          })
        }
      </Masonry>
    )
  }
}

const FeaturedContentPage = ({ data, location }) => {
  const allPages = data.allPages.edges.map(edge => edge.node)
  const [pages, setPages] = useState(allPages)
  const [filter, setFilter] = useState()

  useEffect(() => {
    if (!filter) {
      return setPages(allPages)
    }
    const filtered = allPages.filter(page => page.category === filter)
    setPages(filtered)
  }, [filter, allPages])

  return (
    <Layout theme="white" location={location}>
      <section id="articles" data-aos="fade-up" data-aos-delay="500" className="pt-15 pb-15">
        <Container>
          <Grid container spacing={6}>
            <Grid item sm={12}>
              <div className="">
                <h1 className="text-black mb-3">Featured Content</h1>
                <p>Explore the articles, podcasts, and videos that we've posted.</p>

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

                <ArticleGallery pages={pages} />
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
    allPages(filter: {template: { in: ["article.js"]}}) {
      edges {
        node {
          id
          title
          description
          slug
          template
          content
          category
          author
          date
          next
          head
        }
      }
    }
  }
`;



