// app/store/listings.js

import axios from 'axios';
import { dbUrl } from '../../App';

/**
 * ACTION TYPES
 */
const GET_LISTINGS = 'GET_LISTINGS';
const ADD_LISTING = 'ADD_LISTING';
const DELETE_LISTING = 'DELETE_LISTING';

/**
 * INITIAL STATE
 */
const defaultListings = [];

/**
 * ACTION CREATORS
 */
const getListingsAction = (listings) => (
  {type: GET_LISTINGS, listings}
);

const addListingAction = (listing) => (
  {type: ADD_LISTING, listing}
);

const deleteListingAction = (listingId) => (
  {type: DELETE_LISTING, listingId}
);

/**
 * THUNK CREATORS
 */
export const fetchListings = function() {
  return function thunk(dispatch) {
    return axios.get(dbUrl + '/api/listings')
      .then(res => res.data)
      .then(listings => dispatch(getListingsAction(listings)))
      .catch(err => console.log(err));
  }
}

export const fetchUserListings = function(userId) {
  return function thunk(dispatch) {
    return axios.get(dbUrl + `/api/users/${userId}/listings`)
      .then(res => res.data)
      .then(listings => dispatch(getListingsAction(listings)))
      .catch(error => console.log(error));
  }
}

export const addListing = function(listing, navigation) {
  return function thunk(dispatch) {
    let newListing = null;
    
    return axios.post(dbUrl + '/api/listings', listing)
      .then(res => res.data)
      .then(createdListing => { 
        newListing = createdListing[0];
        dispatch(addListingAction(createdListing[0]));
      })
      .then(() => navigation.navigate('Analysis', { id: newListing.id }))
      .catch(err => navigation.navigate('Error'));
  }
}

export const deleteListing = function(listingId) {
  return function thunk(dispatch) {
    return axios.delete(dbUrl + '/api/listings/' + listingId)
      .then(res => res.data)
      .then(deletedListing => dispatch(deleteListingAction(deletedListing)))
      .catch(err => console.log(err));
  }
}

/**
 * REDUCER
 */
export default function (state = defaultListings, action) {
  switch (action.type) {
    case GET_LISTINGS:
      return action.listings;
    case ADD_LISTING:
      return [...state, action.listing];
    case DELETE_LISTING:
      return state.filter((listing) => {
        return listing.id !== action.listingId;
      });
    default:
      return state;
  }
}
