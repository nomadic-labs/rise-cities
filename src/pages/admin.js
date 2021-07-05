import React from 'react'
import { connect } from "react-redux";
import { filter } from 'lodash'
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
    config: state.adminTools.config
  };
};

class AdminPage extends React.Component {
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

  movePageForward = currentPage => async () => {
    const index = this.props.config["page-order"].indexOf(currentPage.id)

    // abort if page is not in page order array
    // or if it is already the last item in page order array
    if (index < 0 || index === this.props.config["page-order"].length - 1) return false;

    const newPageOrder = [...this.props.config["page-order"]]
    newPageOrder.splice(index, 1)
    newPageOrder.splice(index+1, 0, currentPage.id)

    const db = firestore

    try {
      await db.collection('config').doc('pages').update({ "page-order": newPageOrder })

      this.props.showNotification('Your changes have been saved.')
      this.props.fetchPages();
    } catch (err) {
      console.log(err)
      this.props.showNotification('There was an error saving your changes, please try again.')
    }
  }

  movePageBack = currentPage => async () => {
    const index = this.props.config["page-order"].indexOf(currentPage.id)

    // abort if page is not in page order array
    // or if it is already the first item in page order array
    if (index < 0 || index === 0) return false;

    const newPageOrder = [...this.props.config["page-order"]]
    newPageOrder.splice(index, 1)
    newPageOrder.splice(index-1, 0, currentPage.id)

    const db = firestore

    try {
      await db.collection('config').doc('pages').update({ "page-order": newPageOrder })

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

      const db = firestore
      const batch = db.batch();
      const index = this.props.config["page-order"].indexOf(page.id)
      const newPageOrder = [...this.props.config["page-order"]]
      newPageOrder.splice(index, 1)

      try {
        batch.update(db.collection('pages').doc(page.id), { deleted: true })
        batch.update(db.collection('config').doc('pages'), { "page-order": newPageOrder })

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
    const uncategorizedPages = filter(this.props.pages, page => !page.category || page.category === "uncategorized")
    const categorizedPages = filter(this.props.pages, page => page.category && page.category !== "uncategorized")
    const lastPageId = this.props.config["page-order"].slice(-1)[0]

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
                this.props.config["page-order"].map((pageId, index) => {
                  const page = categorizedPages.find(p => p.id === pageId)
                  if (!page) { return null }
                  return(
                    <div className="ranked-item" key={page.id}>
                      <IconButton size="small" color="primary" onClick={this.movePageBack(page)} disabled={index === 0}><ArrowUp /></IconButton>
                      <IconButton size="small" color="primary" onClick={this.movePageForward(page)} disabled={pageId === lastPageId}><ArrowDown /></IconButton>
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
                uncategorizedPages.map(page => {
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
