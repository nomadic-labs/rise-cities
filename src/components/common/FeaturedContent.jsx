import React from 'react'
import { connect } from "react-redux";
import { Link } from "gatsby";
import { find } from 'lodash'
import Masonry from 'react-masonry-component'

import {
  fetchPages
} from "../../redux/actions";

const mapDispatchToProps = dispatch => {
  return {
    fetchPages: () => {
      dispatch(fetchPages())
    }
  };
};

const mapStateToProps = state => {
  return {
    pages: state.pages.pages
  };
};

class FeaturedContent extends React.Component {
  componentDidMount() {
    this.props.fetchPages()
  }

  nextPage = page => {
    return this.props.pages[page.next];
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

    return(
      <Masonry className="featured-content-collection" options={{ gutter: 16 }}>
        {
          articlePages.map(page => {
            const content = JSON.parse(page.content)
            console.log(page)
            return(
              <div className="featured-content-item mb-10" key={page.id}>
                {content.headerImage && <img src={content.headerImage.imageSrc} alt="" />}
                <p className="mb-1 text-xs text-uppercase">{page.category}</p>
                <h3 className="mb-3 mt-0">{page.title}</h3>
                <Link to={page.slug} className="pretty-link text-sm">Read more</Link>
              </div>
            )
          })
        }
      </Masonry>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeaturedContent);