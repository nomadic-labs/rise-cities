import React from 'react'
import { Link } from "gatsby";
import { find } from 'lodash'
import Masonry from 'react-masonry-component'
import { StaticQuery, graphql } from "gatsby"
import LazyLoad from 'react-lazyload';
import ensureAbsoluteUrl from '../../utils/ensureAbsoluteUrl';

class FeaturedContent extends React.Component {

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
    const articlePages = this.orderedPages(find(this.props.pages, page => page.head))
    const featuredPages = articlePages.filter(p => p.featured)

    return(
      <LazyLoad offset={200}>
        <Masonry className="featured-content-collection" options={{ gutter: 16 }}>
          {
            featuredPages.map(page => {
              const content = JSON.parse(page.content)
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
                  <p className="text-xs mt-2">{page.description}</p>
                </div>
              )
            })
          }
        </Masonry>
      </LazyLoad>
    )
  }
}

const Wrapper = () => {
  return (
    <StaticQuery
      query={graphql`
        query FeaturedContentQuery {
          allPages(filter: {template: { in: ["article.js"]}}) {
            edges {
              node {
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
          }
        }
      `}
      render={data => {
        console.log(data)
        const pages = data.allPages.edges.map(e => e.node)
        return <FeaturedContent pages={pages} />
      }}
    />
  )
}

export default Wrapper;