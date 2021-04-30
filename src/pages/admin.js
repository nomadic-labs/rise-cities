import React from 'react'
import { connect } from "react-redux";
import { filter, find } from 'lodash'
import Container from "@material-ui/core/Container"
import IconButton from "@material-ui/core/IconButton"
import DeleteForever from "@material-ui/icons/DeleteForever"
import ArrowUp from '@material-ui/icons/KeyboardArrowUp';
import ArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { push, Link } from 'gatsby'
import { firestore } from "../firebase/init";

import Layout from '../layouts/default';
import ProtectedPage from "../layouts/protected-page"

import { PERMANENT_PAGES } from "../utils/constants"

import {
  fetchPages,
  fetchUsers,
  fetchBrowserNotifications,
  deploy,
  userLoggedOut,
  showNotification,
  deleteAccount,
} from "../redux/actions";


const mapDispatchToProps = dispatch => {
  return {
    fetchPages: () => {
      dispatch(fetchPages())
    },
    fetchUsers: () => {
      dispatch(fetchUsers())
    },
    fetchBrowserNotifications: () => {
      dispatch(fetchBrowserNotifications())
    },
    deploy: () => {
      dispatch(deploy())
    },
    userLoggedOut: () => {
      dispatch(userLoggedOut());
    },
    showNotification: (msg) => {
      dispatch(showNotification(msg));
    },
    deleteAccount: () => {
      dispatch(deleteAccount());
    },
  };
};

const mapStateToProps = state => {
  return {
    isEditingPage: state.adminTools.isEditingPage,
    user: state.adminTools.user,
    pages: state.pages.pages,
    users: state.adminTools.users,
    accessCode: state.adminTools.accessCode,
    browserNotifications: state.adminTools.browserNotifications,
  };
};

class AdminPage extends React.Component {
  state = { accessCode: '' }

  componentDidMount() {
    this.props.fetchPages()
    if (this.props.user?.isAdmin) {
      this.props.fetchUsers()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      if (this.props.user?.isAdmin) {
        this.props.fetchUsers()
      }
    }
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

  movePageForward = currentPage => async () => {
    if (!currentPage.next) return false;

    const nextPage = this.nextPage(currentPage)
    const prevPage = this.prevPage(currentPage)

    const db = firestore
    const batch = db.batch();

    try {
      batch.update(db.collection('pages').doc(currentPage.id), { next: nextPage.next || null })
      batch.update(db.collection('pages').doc(nextPage.id), { next: currentPage.id })

      if (currentPage.head) {
        batch.update(db.collection('pages').doc(nextPage.id), { head: true })
        batch.update(db.collection('pages').doc(currentPage.id), { head: null })
      }

      if (prevPage) {
        batch.update(db.collection('pages').doc(prevPage.id), { next: nextPage.id })
      }

      await batch.commit();
      this.props.showNotification('Your changes have been saved.')
      this.props.fetchPages();
    } catch (err) {
      console.log(err)
      this.props.showNotification('There was an error saving your changes, please try again.')
    }
  }

  movePageBack = currentPage => async () => {
    const prevPage = this.prevPage(currentPage)
    if (!prevPage) return false

    const prevPrevPage = this.prevPage(prevPage)
    const db = firestore
    const batch = db.batch();

    try {
      batch.update(db.collection('pages').doc(currentPage.id), { next: prevPage.id })
      batch.update(db.collection('pages').doc(prevPage.id), { next: currentPage.next || null })

      if (prevPage.head) {
        batch.update(db.collection('pages').doc(currentPage.id), { head: true })
        batch.update(db.collection('pages').doc(prevPage.id), { head: null })
      }

      if (prevPrevPage) {
        batch.update(db.collection('pages').doc(prevPrevPage.id), { next: currentPage.id })
      }

      await batch.commit();
      this.props.showNotification('Your changes have been saved.')
      this.props.fetchPages();
    } catch (err) {
      console.log(err)
      this.props.showNotification('There was an error saving your changes, please try again.')
    }
  }

  deletePage = page => async () => {
    if (typeof window !== 'undefined')  {
      if (!window.confirm("Are you sure you want to delete this page?")) {
        return false
      }

      const prevPage = this.prevPage(page)
      const nextPage = this.nextPage(page)

      const db = firestore
      const batch = db.batch();

      try {
        batch.delete(db.collection('pages').doc(page.id))

        if (prevPage) {
          batch.update(db.collection('pages').doc(prevPage.id), { next: page.next || null })
        }

        if (page.head && nextPage) {
          batch.update(db.collection('pages').doc(nextPage.id), { head: true })
        }

        await batch.commit();
        this.props.showNotification('Your changes have been saved.')
        this.props.fetchPages();
      } catch (err) {
        console.log(err)
        this.props.showNotification('There was an error saving your changes, please try again.')
      }
    }
  }

  logout = e => {
    this.props.userLoggedOut();
    push("/");
  };

  assignEditor = async (user) => {
    await firestore.collection('users').doc(user.uid).update({ isEditor: true })
    this.props.fetchUsers()
    this.props.showNotification(`${user.displayName} is now an Editor on this website.`)
  }

  removeEditor = async (user) => {
    await firestore.collection('users').doc(user.uid).update({ isEditor: false })
    this.props.fetchUsers()
    this.props.showNotification(`${user.displayName} is no longer an Editor on this website.`)
  }

  render() {
    const unorderedPages = filter(this.props.pages, page => !page.category || page.category === "uncategorized")
    const articlePages = this.orderedPages(find(this.props.pages, page => page.head))

    return(
      <Layout theme="white" className="admin-page mt-10 pt-10">
        <ProtectedPage>
          <Container>
            <h1 className="">
              Website Configuration
            </h1>
          </Container>

          <Container>
            <h2>Page Order</h2>
            <div className="my-40">
              {
                articlePages.map(page => {
                  return(
                    <div className="ranked-item" key={page.id}>
                      <IconButton size="small" color="primary" onClick={this.movePageBack(page)} disabled={page.head}><ArrowUp /></IconButton>
                      <IconButton size="small" color="primary" onClick={this.movePageForward(page)} disabled={!page.next}><ArrowDown /></IconButton>
                      <IconButton size="small" color="primary" onClick={this.deletePage(page)} disabled={PERMANENT_PAGES.includes(page.id)}><DeleteForever /></IconButton>
                      <span className="ml-3"><Link to={page.slug}>{page.title}</Link></span>
                    </div>
                  )
                })
              }
            </div>
          </Container>

          <Container>
            <h2>Uncategorized Pages</h2>
            <div className="my-40">
              {
                unorderedPages.map(page => {
                  return(
                    <div className="ranked-item" key={page.id}>
                      <IconButton size="small" color="primary" onClick={this.deletePage(page)} disabled={PERMANENT_PAGES.includes(page.id)}><DeleteForever /></IconButton>
                      <span className="ml-3"><Link to={page.slug} className="pretty-link">{page.title}</Link></span>
                    </div>
                  )
                })
              }
            </div>
          </Container>

          <Container>
            <div className="mt-10 mb-10">
              <button onClick={this.props.deploy} className="btn">Publish changes</button>
            </div>
          </Container>

          <Container>
            <h1 className="">
              Account Management
            </h1>
            <div className="mt-10 mb-10">
              <button onClick={this.props.deleteAccount} className="btn btn-white">Delete my account</button>
            </div>
            {
              this.props.user?.isAdmin &&
              <div className="mb-10">
                <h2>User accounts</h2>
                <div className="my-40">
                  {
                    this.props.users.filter(u => u.uid !== this.props.user?.uid).map(user => {
                      return(
                        <Accordion key={user.uid}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${user.uid}-content`}
                            id={`${user.uid}-header`}
                          >
                            <div className="text-bold">{user.displayName}</div>
                          </AccordionSummary>
                          <AccordionDetails>
                            {
                              user.isAdmin ?
                              <div>
                                <p className="mt-0">{`Email: ${user.email}`}</p>
                                <p>This user is an Admin so you cannot edit their account. Contact your website administrator for assistance.</p>
                              </div>:
                              <div className="account-actions">
                                <p className="mt-0">{`Email: ${user.email}`}</p>
                                {
                                  user.isEditor ?
                                  <button className="btn btn-sm mr-1" onClick={() => this.removeEditor(user)}>Remove Editor</button> :
                                  <button className="btn btn-sm mr-1" onClick={() => this.assignEditor(user)}>Assign Editor</button>
                                }
                              </div>
                            }
                          </AccordionDetails>
                        </Accordion>
                      )
                    })
                  }
                </div>
              </div>
            }
          </Container>
        </ProtectedPage>
      </Layout>
    )
  }

}


export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
