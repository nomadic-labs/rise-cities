import { createStore as reduxCreateStore } from "redux"
import { applyMiddleware } from "redux"
import { appReducers } from './reducers'
import thunk from 'redux-thunk';

const initialState = {
  adminTools: { isLoggedIn: false, isEditingPage: false },
  navigation: { currentLang: "en" },
  pages: { pages: {}, orderedPages: [] },
  profiles: { profiles: [] },
  events: { events: [] },
  partners: { partners: [] },
}

const createStore = () => reduxCreateStore(appReducers, initialState, applyMiddleware(thunk))

export default createStore;