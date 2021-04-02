import axios from "axios";
import firebase, { firestore } from "../firebase/init";
// import { copyContentFromStaging } from "../firebase/operations"
import { NOTIFICATION_MESSAGES } from "../utils/constants";


// AUTHENTICATION ------------------------

export function userLoggedIn(user = null) {
  return { type: "USER_LOGGED_IN", user };
}

export function userLoggedOut() {
  return { type: "USER_LOGGED_OUT" };
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

export function savePage(pageData, pageId) {
  return dispatch => {
    const db = firestore;
    db
      .collection('pages')
      .doc(pageId)
      .set(pageData)
      .then(snap => {
        dispatch(toggleNewPageModal());
        dispatch(
          showNotification(
            "Your page has been saved. Publish your changes to view and edit the page.",
            "success"
          )
        );
      });
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

export function setOrderedPages(orderedPages) {
  return { type: "SET_ORDERED_PAGES", orderedPages }
}

export function fetchPages() {
  return (dispatch, getState) => {
    const db = firestore;

    db.collection('pages')
      .get()
      .then(snap => {
        const pagesArr = snap.docs.map(d => ({ ...d.data(), id: d.id }))
        const pages = pagesArr.reduce((obj, page) => {
          obj[page.id] = page
          return obj
        }, {})

        dispatch(setPages(pages));
      })
      .catch(error => {
        console.log("Error fetching pages", error)
      })
  };
}

export function incrementPageOrder(currentPage, nextPage, prevPage) {
  return (dispatch, getState) => {
    const db = firestore;
    const batch = db.batch();
    const FieldValue = firebase.firestore.FieldValue;

    const currentPageRef = db.collection('pages').doc(currentPage.id)
    const nextPageRef = db.collection('pages').doc(nextPage.id)
    const prevPageRef = prevPage ? db.collection('pages').doc(prevPage.id) : null

    batch.update(currentPageRef, { next: nextPage.next || FieldValue.delete() })
    batch.update(nextPageRef, { next: currentPage.id })

    if (currentPage.head) {
      batch.update(nextPageRef, { head: true })
      batch.update(currentPageRef, { head: FieldValue.delete() })
    }

    if (prevPageRef) {
      batch.update(prevPageRef, { next: nextPage.id })
    }

    batch
      .commit()
      .then(() => {
        dispatch(fetchPages());
        dispatch(showNotification("Your changes have been saved."));
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

export function decrementPageOrder(currentPage, prevPage, prevPrevPage) {
  return (dispatch, getState) => {
    const db = firestore;
    const batch = db.batch();
    const FieldValue = firebase.firestore.FieldValue;

    const currentPageRef = db.collection('pages').doc(currentPage.id)
    const prevPageRef = db.collection('pages').doc(prevPage.id)
    const prevPrevPageRef = prevPrevPage ? db.collection('pages').doc(prevPrevPage.id) : null

    batch.update(currentPageRef, { next: prevPage.id })
    batch.update(prevPageRef, { next: currentPage.next || FieldValue.delete() })

    if (prevPage.head) {
      batch.update(currentPageRef, { head: true })
      batch.update(prevPageRef, { head: FieldValue.delete() })
    }

    if (prevPrevPageRef) {
      batch.update(prevPrevPageRef, { next: currentPage.id })
    }

    batch
      .commit()
      .then(() => {
        dispatch(fetchPages());
        dispatch(showNotification("Your changes have been saved."));
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

export function deletePage(page, nextPage, prevPage, allPages) {
  return (dispatch, getState) => {
    const db = firestore;
    const batch = db.batch();
    const FieldValue = firebase.firestore.FieldValue;

    batch.delete(db.collection('pages').doc(page.id))

    if (prevPage) {
      const prevPageRef = db.collection('pages').doc(prevPage.id)
      batch.update(prevPageRef, { next: page.next || FieldValue.delete() })
    }

    if (page.head && nextPage) {
      const nextPageRef = db.collection('pages').doc(nextPage.id)
      batch.update(nextPageRef, { head: true })
    }

    const transPageIds = Object.keys(allPages).filter(key => allPages[key].translation === page.slug)
    console.log({transPageIds})
    transPageIds.forEach(id => {
      batch.update(db.collection('pages').doc(id), { translation: FieldValue.delete() })
    })

    batch
      .commit()
      .then(() => {
        dispatch(fetchPages());
        dispatch(showNotification("Your changes have been saved."));
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
