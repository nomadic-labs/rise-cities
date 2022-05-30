import React from 'react'
import { Link } from "gatsby";
import Masonry from 'react-masonry-component'
import { StaticQuery, graphql } from "gatsby"
import LazyLoad from 'react-lazyload';
import ensureAbsoluteUrl from '../../utils/ensureAbsoluteUrl';

const FeaturedContent = ({ pages }) => {
  return(
    <LazyLoad offset={200}>
      <Masonry className="featured-content-collection" options={{ gutter: 16 }}>
        {
          pages.map(page => {
            const content = JSON.parse(page.content)
            const dateString = page.date ? new Date(parseInt(page.date)).toDateString() : ""
            return(
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
                <p className="text-xs text-uppercase text-muted mb-1">{dateString}</p>
                <p className="text-xs mt-2">{page.description}</p>
              </div>
            )
          })
        }
      </Masonry>
    </LazyLoad>
  )
}

const Wrapper = () => {
  return (
    <StaticQuery
      query={graphql`
        query FeaturedContentQuery {
          allPages(filter: {template: {in: ["article.js"]}, deleted: { ne: true }, featured: { eq: true } }) {
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
      `}
      render={data => {
        const allPages = data.allPages.nodes
        const pageOrder = data.allConfig.nodes[0].page_order
        const orderedPages = pageOrder.map(pageId => allPages.find(p => p.id === pageId)).filter(i => i)
        return <FeaturedContent pages={orderedPages} />
      }}
    />
  )
}

export default Wrapper;