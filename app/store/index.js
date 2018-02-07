// app/store/index.js

import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';

import listings from './listings';
import user from './user';

const reducer = combineReducers({
  user,
  listings
});

const middleware = composeWithDevTools(applyMiddleware(
  thunkMiddleware
  //logger
));

const store = createStore(reducer, middleware);

export default store;
export * from './listings';
export * from  './user';