import axios from "axios";
import firebase, { firestore } from "../firebase/init";
// import { copyContentFromStaging } from "../firebase/operations"
import { NOTIFICATION_MESSAGES, PAGE_TEMPLATES } from "../utils/constants";


// AUTHENTICATION ------------------------

export function userLoggedIn(user = null) {
  return { type: "USER_LOGGED_IN", user };
}

export function userLoggedOut() {
  return { type: "USER_LOGGED_OUT" };
}

export function deleteAccount(user) {
  return (dispatch, getState) => {
    if (typeof window !== 'undefined')  {
      if (!window.confirm("Are you sure you want to permanently delete your account?")) {
        return false
      }

      const db = firestore;
      const user = firebase.auth().currentUser;
      console.log("user", user)

      db
        .collection('users')
        .doc(user.uid)
        .delete()
        .then(res => {
          user.delete().then(() => {
            dispatch(showNotification('Your account has been deleted.'))
          }).catch(function(error) {
            dispatch(showNotification('There was an error deleting your account. Please contact the website administrator.'))
          });
        })
        .catch(function(error) {
          dispatch(showNotification('There was an error deleting your account. Please contact the website administrator.'))
        });
    }
  }
}

// NOTIFICATIONS ------------------------

export function showNotification(message, color="success") {
  return { type: "SHOW_NOTIFICATION", message, color };
}

export function closeNotification() {
  return { type: "CLOSE_NOTIFICATION" };
}

export function showNotificationByName(name) {
  return dispatch => {
    const message = NOTIFICATION_MESSAGES[name];
    dispatch( (message, "success"));
  };
}

// PAGE EDITING ------------------------


export function updateSectionContent(sectionIndex, contentIndex, newContent) {
  return {
    type: "UPDATE_SECTION_CONTENT",
    sectionIndex,
    contentIndex,
    newContent
  };
}

export function addSection(sectionIndex, sectionType="default") {
  return { type: "ADD_SECTION", sectionIndex, sectionType };
}

export function duplicateSection(sectionIndex) {
  return { type: "DUPLICATE_SECTION", sectionIndex };
}

export function deleteSection(sectionIndex) {
  return { type: "DELETE_SECTION", sectionIndex };
}

export function addContentItem(sectionIndex, contentType) {
  return { type: "ADD_CONTENT_ITEM", sectionIndex, contentType };
}

export function updateContentItem(sectionIndex, contentIndex, content) {
  return { type: "UPDATE_CONTENT_ITEM", sectionIndex, contentIndex , content};
}

export function deleteContentItem(sectionIndex, contentIndex) {
  return { type: "DELETE_CONTENT_ITEM", sectionIndex, contentIndex };
}

export function toggleEditing() {
  return { type: "TOGGLE_EDITING" };
}

export function toggleNewPageModal(options) {
  return { type: "TOGGLE_NEW_PAGE_MODAL", options };
}

export function updatePageTitle(title) {
  return { type: "UPDATE_PAGE_TITLE", title };
}

export function updatePageHeaderImage(content) {
  return { type: "UPDATE_PAGE_HEADER_IMAGE", content };
}

export function updatePageContentState(location, content) {
  return { type: "UPDATE_PAGE_CONTENT", location, content };
}

export function setPageContentState(location, content) {
  return { type: "SET_PAGE_CONTENT", location, content };
}

export function createPage(pageData, pageId) {
  return dispatch => {
    const db = firestore;
    const batch = db.batch();
    const FieldValue = firebase.firestore.FieldValue;

    batch.set(db.collection('pages').doc(pageId), pageData)

    // add article pages to page order
    if (pageData.template === PAGE_TEMPLATES[0].value) {
      batch.update(db.collection('config').doc('pages'), { "page-order": FieldValue.arrayUnion(pageId) })
    }

    batch
      .commit()
      .then(res => {
        console.log({res})
        dispatch(toggleNewPageModal());
        dispatch(fetchPages());
        dispatch(
          showNotification(
            "Your page has been created. Publish your changes to view and edit the page.",
            "success"
          )
        );
      })
      .catch(err => {
        console.log(err)
        dispatch(
          showNotification('There was an error saving your changes, please try again.')
        );
      })
  };
}

export function savePage(pageData, pageId) {
  return dispatch => {
    const db = firestore;
    db
      .collection('pages')
      .doc(pageId)
      .update(pageData)
      .then(snap => {
        dispatch(toggleNewPageModal());
        dispatch(updatePageTitle(pageData.title))
        dispatch(
          showNotification(
            "Your page has been updated. Don't forget to publish your changes!",
            "success"
          )
        );
      });
  };
}

export function updatePageOrder(pageOrder) {
  return dispatch => {
    const db = firestore;

    db
      .collection('config')
      .doc('pages')
      .update({ 'page-order': pageOrder })
      .then(snap => {
        console.log("Page order updated.")
      })
      .catch(err => {
        console.log("Error updating page order", err)
      })
  };
}


// rename to updateContent
export function updatePageContent(key, newContent) {
  console.log({ [key]: newContent })
  return (dispatch, getState) => {
    const db = firestore;
    const pageId = getState().page.data.id;
    const content = { ...getState().page.data.content };

    console.log({pageId})
    console.log({content})

    if (!newContent) {
      delete content[key]
    } else {
      content[key] = newContent
    }

    db
      .collection('pages')
      .doc(pageId)
      .update({ content: JSON.stringify(content) })
      .then(res => {
        console.log({ res })
        dispatch(updatePageData(content));
        dispatch(
          showNotification(
            "Your changes have been saved. Publish your changes to make them public.",
            "success"
          )
        )
      })
      .catch(error => {
        console.log({error})
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      })
  };
}

export function updateTitle(title) {
  return (dispatch, getState) => {
    const db = firestore;
    const pageId = getState().page.data.id;

    db
      .collection('pages')
      .doc(pageId)
      .update({ title })
      .then(() => {
        dispatch(updatePageTitle(title));
        dispatch(
          showNotification(
            "Your changes have been saved. Publish your changes to make them public.",
            "success"
          )
        )
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      })
  };
}

export function updateHeaderImage(content) {
  return (dispatch, getState) => {
    const db = firestore;
    const pageId = getState().page.data.id;

    db
      .collection('pages')
      .doc(pageId)
      .update({ headerImage: content })
      .then(() => {
        dispatch(updatePageHeaderImage(content));
        dispatch(
          showNotification(
            "Your changes have been saved. Publish your changes to make them public.",
            "success"
          )
        )
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      })
  };
}

export function deleteHeaderImage() {
  return (dispatch, getState) => {
    const db = firestore;
    const FieldValue = firebase.firestore.FieldValue;
    const pageId = getState().page.data.id;

    db
      .collection('pages')
      .doc(pageId)
      .update({ 'content.headerImage': FieldValue.delete() })
      .then(() => {
        dispatch(updatePageHeaderImage({ imageSrc: null, title: null }));
        dispatch(
          showNotification(
            "Your changes have been saved. Publish your changes to make them public.",
            "success"
          )
        )
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      })
  };
}

export function updateFirebaseData(updates, callback=null) {
  return (dispatch, getState) => {
    const db = firestore;
    console.log(updates)

    db.ref().update(updates, error => {
      if (error) {
        console.log('FIREBASE ERROR', error)
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      }

      if (callback) {
        callback()
      }

      dispatch(
        showNotification(
          "Your changes have been saved. Publish your changes to make them public.",
          "success"
        )
      );
    });
  };
}

export function savePageContent(innerFunction) {
  return (dispatch, getState) => {
    Promise.resolve(dispatch(innerFunction)).then(() => {
      const content = getState().page.data.content;
      const pageId = getState().page.data.id;

      console.log("content", content)
      console.log("pageId", pageId)

      const db = firestore;

      db.collection('pages')
        .doc(pageId)
        .update({ content: JSON.stringify(content) })
        .then(res => {
          dispatch(
            showNotification(
              "Your changes have been saved. Publish your changes to make them public.",
              "success"
            )
          );
        })
        .catch(error => {
          console.log('error', error)
          return dispatch(
            showNotification(
              `There was an error saving your changes: ${error}`,
              "success"
            )
          );
        })
    });
  };
}

export function updateFirestoreDoc(pageId, data) {
  return (dispatch, getState) => {
    const db = firestore;

    db.collection('pages')
      .doc(pageId)
      .update(data)
      .then(res => {
        dispatch(
          showNotification(
            "Your changes have been saved. Publish your changes to make them public.",
            "success"
          )
        );
      })
      .catch(error => {
        console.log('error', error)
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      })
  };
}

export function deploy() {
  return dispatch => {
    const url = `${process.env.GATSBY_DEPLOY_ENDPOINT}`;
    console.log(`Deploy command sent to ${url}`);

    firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then(token => {
        return axios({
          method: "POST",
          url: url,
          headers: { Authorization: "Bearer " + token }
        });
      })
      .then(res => {
        console.log(res);
        if (res.data.status === "ok") {
          dispatch(
            showNotification(
              res.data.message,
              "success"
            )
          );
        } else {
          dispatch(
            showNotification(
              `There was an error deploying the site: ${res.data.message}`,
              "danger"
            )
          );
        }
      })
      .catch(err => {
        dispatch(
          showNotification(
            `There was an error deploying the site: ${err}`,
            "danger"
          )
        );
      });
  };
}

// export function deployWithStagingContent() {
//   return dispatch => {
//     copyContentFromStaging()
//       .then(() => {
//         dispatch(
//           showNotification(
//             "Your content has been copied from the staging site.",
//             "success"
//           )
//         );
//         dispatch(deploy())
//       })
//       .catch(err => {
//         dispatch(
//           showNotification(
//             `There was an error copying the content from the staging site: ${err}`,
//             "danger"
//           )
//         );
//       })
//   }
// }

export function loadPageData(data) {
  return { type: "LOAD_PAGE_DATA", data };
}

export function updatePageData(content) {
  return { type: "UPDATE_PAGE_DATA", content };
}

export function updatePageField(field, value) {
  return { type: "UPDATE_PAGE_FIELD", field, value };
}

export function setPages(pages) {
  return { type: "SET_PAGES", pages }
}

export function setConfig(config) {
  return { type: "SET_CONFIG", config }
}

export function setOrderedPages(orderedPages) {
  return { type: "SET_ORDERED_PAGES", orderedPages }
}

export function fetchPages() {
  return (dispatch, getState) => {
    const db = firestore;

    db.collection('pages')
      .get()
      .then(snap => {
        const pages = snap.docs.map(d => ({ ...d.data(), id: d.id }))
        const publishedPages = pages.filter(p => !p.deleted)
        dispatch(setPages(publishedPages));
      })
      .then(() => {
        db.collection('config')
          .doc('pages')
          .get()
          .then(doc => {
            const config = doc.data()
            dispatch(setConfig(config));
          })
          .catch(error => {
            console.log("Error fetching page order", error)
          })
      })
      .catch(error => {
        console.log("Error fetching pages", error)
      })

  };
}


// NAVIGATION ------------------------

export function openMenu() {
  return { type: "OPEN_MENU" };
}

export function closeMenu() {
  return { type: "CLOSE_MENU" };
}

export function toggleMenu() {
  return { type: "TOGGLE_MENU" };
}

export function setCurrentLang(currentLang) {
  return { type: "SET_CURRENT_LANG", currentLang }
}

// ---------- Profiles

export function fetchProfiles() {
  return (dispatch, getState) => {
    const db = firestore;

    db.collection(`profiles`)
      .get()
      .then(snap => {
        const profiles = snap.docs.map(d => ({ ...d.data(), id: d.id }))
        if (profiles) {
          dispatch(setProfiles(profiles));
        }
      })
      .catch(error => {
        console.log("Error fetching profiles", error)
      })
  };
}

export function updateProfile(id, profile) {
  return { type: "UPDATE_PROFILE", id, profile }
}

export function setProfiles(profiles) {
  return { type: "SET_PROFILES", profiles }
}

export function saveProfile(profileId, profile) {
  return (dispatch, getState) => {
    const db = firestore;

    db
      .collection('profiles')
      .doc(profileId)
      .update(profile)
      .then(() => {
        dispatch(updateProfile(profileId, profile));
        dispatch(
          showNotification(
            "Your changes have been saved.",
            "success"
          )
        );
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "error"
          )
        );
      })
  };
}

export function removeProfile(profileId) {
  return (dispatch, getState) => {
    const db = firestore;

    db
      .collection(`profiles`)
      .doc(profileId)
      .delete()
      .then(() => {
        dispatch(fetchProfiles());
        dispatch(
          showNotification(
            "Your changes have been saved.",
            "success"
          )
        );
      })
      .catch(error => {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      })
  };
}

// ---------- Events

export function fetchEvents() {
  return (dispatch, getState) => {
    const db = firestore;

    db.collection(`events`)
      .get()
      .then(snap => {
        const events = snap.docs.map(d => ({ ...d.data(), id: d.id }))
        console.log({events})
        if (events) {
          dispatch(setEvents(events));
        }
      })
      .catch(error => {
        console.log("Error fetching events", error)
      })
  };
}

export function updateEvent(id, event) {
  return { type: "UPDATE_EVENT", id, event }
}

export function setEvents(events) {
  return { type: "SET_EVENTS", events }
}

export function saveEvent(eventId, event) {
  return (dispatch, getState) => {
    const db = firestore;

    db
      .collection('events')
      .doc(eventId)
      .update(event)
      .then(() => {
        dispatch(updateEvent(eventId, event));
        dispatch(
          showNotification(
            "Your changes have been saved.",
            "success"
          )
        );
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "error"
          )
        );
      })
  };
}

export function removeEvent(eventId) {
  return (dispatch, getState) => {
    const db = firestore;

    db
      .collection(`events`)
      .doc(eventId)
      .delete()
      .then(() => {
        dispatch(fetchEvents());
        dispatch(
          showNotification(
            "Your changes have been saved.",
            "success"
          )
        );
      })
      .catch(error => {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      })
  };
}

// ---------- Partners

export function fetchPartners() {
  return (dispatch, getState) => {
    const db = firestore;

    db.collection(`partners`)
      .get()
      .then(snap => {
        const partners = snap.docs.map(d => ({ ...d.data(), id: d.id }))
        if (partners) {
          dispatch(setProfiles(partners));
        }
      })
      .catch(error => {
        console.log("Error fetching partners", error)
      })
  };
}

export function updatePartner(id, partner) {
  return { type: "UPDATE_PARTNER", id, partner }
}

export function setPartners(partners) {
  return { type: "SET_PARTNERS", partners }
}

export function savePartner(partnerId, partner) {
  return (dispatch, getState) => {
    const db = firestore;

    db
      .collection('partners')
      .doc(partnerId)
      .update(partner)
      .then(() => {
        dispatch(updateProfile(partnerId, partner));
        dispatch(
          showNotification(
            "Your changes have been saved.",
            "success"
          )
        );
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "error"
          )
        );
      })
  };
}

export function removePartner(partnerId) {
  return (dispatch, getState) => {
    const db = firestore;

    db
      .collection(`partners`)
      .doc(partnerId)
      .delete()
      .then(() => {
        dispatch(fetchPartners());
        dispatch(
          showNotification(
            "Your changes have been saved.",
            "success"
          )
        );
      })
      .catch(error => {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      })
  };
}


// ADMIN ----------------

export function setUsers(users) {
  return { type: "SET_USERS", users }
}

export function fetchUsers() {
  return (dispatch, getState) => {
    const db = firestore

    db.collection(`users`)
      .get()
      .then(snap => {
        const users = snap.docs.map(d => ({ ...d.data(), id: d.id }))
        if (users) {
          dispatch(setUsers(users));
        }
      })
      .catch(error => {
        console.log("Error fetching users", error)
      })
  };
}

export function saveCurriculum(id, module) {
  return (dispatch) => {
    const db = firestore;

    const collection = db.collection('curriculum');

    new Promise((resolve) => {
      if (id) {
        resolve(collection.doc(id));
      } else {
        resolve(collection.add({}));
      }
    })
    .then((doc) => {
      doc
        .update(module)
        .then(() => {
          dispatch(
            showNotification(
              "Your changes have been saved. Publish your changes to view and edit the page.",
              "success"
            )
          );
        });
    })
    .catch(error => {
      dispatch(
        showNotification(
          `There was an error saving your changes: ${error}`,
          "error"
        )
      );
    });
  };
}

export function deleteCurriculum(id) {
  return (dispatch) => {
    const db = firestore;

    db
      .collection('curriculum')
      .doc(id)
      .delete()
      .then(() => {
        dispatch(
          showNotification(
            "Your changes have been saved. Publish your changes to view and edit the page.",
            "success"
          )
        );
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "error"
          )
        );
      })
  };
}