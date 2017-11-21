/* global fetch */
import _ from 'lodash';
import configure from '../../../../modules/configure';
import * as loader from '../../../../data/loader/actions';

export const RETRIEVE_ONE_WAITING = 'Admin/data/shop/RETRIEVE_ONE_WAITING';
export const RETRIEVE_ONE_SUCCESS = 'Admin/data/shop/RETRIEVE_ONE_SUCCESS';
export const RETRIEVE_ONE_FAILURE = 'Admin/data/shop/RETRIEVE_ONE_FAILURE';
export const RETRIEVE_MANY_WAITING = 'Admin/data/shop/RETRIEVE_MANY_WAITING';
export const RETRIEVE_MANY_SUCCESS = 'Admin/data/shop/RETRIEVE_MANY_SUCCESS';
export const RETRIEVE_MANY_FAILURE = 'Admin/data/shop/RETRIEVE_MANY_FAILURE';
export const MODIFY_ONE_WAITING = 'Admin/data/shop/MODIFY_ONE_WAITING';
export const MODIFY_ONE_SUCCESS = 'Admin/data/shop/MODIFY_ONE_SUCCESS';
export const MODIFY_ONE_FAILURE = 'Admin/data/shop/MODIFY_ONE_FAILURE';
export const CREATE_ONE_WAITING = 'Admin/data/shop/CREATE_ONE_WAITING';
export const CREATE_ONE_SUCCESS = 'Admin/data/shop/CREATE_ONE_SUCCESS';
export const CREATE_ONE_FAILURE = 'Admin/data/shop/CREATE_ONE_FAILURE';
export const REMOVE_ONE_WAITING = 'Admin/data/shop/REMOVE_ONE_WAITING';
export const REMOVE_ONE_SUCCESS = 'Admin/data/shop/REMOVE_ONE_SUCCESS';
export const REMOVE_ONE_FAILURE = 'Admin/data/shop/REMOVE_ONE_FAILURE';
export const REMOVE_MANY_WAITING = 'Admin/data/shop/REMOVE_MANY_WAITING';
export const REMOVE_MANY_SUCCESS = 'Admin/data/shop/REMOVE_MANY_SUCCESS';
export const REMOVE_MANY_FAILURE = 'Admin/data/shop/REMOVE_MANY_FAILURE';

const retrieveOneWaiting = () => {
  return {
    type: RETRIEVE_ONE_WAITING,
  };
};
const retrieveOneSuccess = (shop) => {
  return {
    type: RETRIEVE_ONE_SUCCESS,
    shop,
  };
};
const retrieveOneFailure = (error) => {
  return {
    type: RETRIEVE_ONE_FAILURE,
    error,
  };
};
export const retrieveOneRequest = (_id) => {
  return (dispatch) => {
    dispatch(loader.on());
    dispatch(retrieveOneWaiting());
    return fetch(`${configure.API}/shop/${_id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'cache-control': 'no-cache',
      },
    })
      .then((res) => {
        dispatch(loader.off());
        if (res.ok) { return res.json(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then((res) => {
        if (res.data) {
          return dispatch(retrieveOneSuccess(res.data));
        }
        return dispatch(retrieveOneFailure({
          error: null,
          message: 'response에 data 프로퍼티가 없습니다.'
        }));
      })
      .catch(e => dispatch(retrieveOneFailure(e)));
  };
};
const retrieveManyWaiting = () => {
  return {
    type: RETRIEVE_MANY_WAITING,
  };
};
const retrieveManySuccess = (shops) => {
  return {
    type: RETRIEVE_MANY_SUCCESS,
    shops,
  };
};
const retrieveManyFailure = (error) => {
  return {
    type: RETRIEVE_MANY_FAILURE,
    error,
  };
};
export const retrieveManyRequest = () => {
  return (dispatch) => {
    dispatch(loader.on());
    dispatch(retrieveManyWaiting());
    return fetch(`${configure.API}/shop`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'cache-control': 'no-cache',
      },
    })
      .then((res) => {
        dispatch(loader.off());
        if (res.ok) { return res.json(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then((res) => {
        if (res.data) {
          return dispatch(retrieveManySuccess(res.data));
        }
        return dispatch(retrieveManyFailure({
          error: null,
          message: 'response에 data 프로퍼티가 없습니다.'
        }));
      })
      .catch(e => dispatch(retrieveManyFailure(e)));
  };
};
const modifyOneWaiting = () => {
  return {
    type: MODIFY_ONE_WAITING,
  };
};
const modifyOneSuccess = () => {
  return {
    type: MODIFY_ONE_SUCCESS,
  };
};
const modifyOneFailure = (error) => {
  return {
    type: MODIFY_ONE_FAILURE,
    error,
  };
};
export const modifyOneRequest = (shop) => {
  return (dispatch) => {
    dispatch(loader.on());
    dispatch(modifyOneWaiting());
    return fetch(`${configure.API}/shop`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: shop,
      }),
    })
      .then((res) => {
        dispatch(loader.off());
        if (res.ok) { return res.json(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then((res) => {
        if (res.data) {
          return dispatch(modifyOneSuccess(res.data));
        }
        return dispatch(modifyOneFailure({
          error: null,
          message: 'response에 data 프로퍼티가 없습니다.'
        }));
      })
      .catch(e => dispatch(modifyOneFailure(e)));
  };
};
const createOneWaiting = () => {
  return {
    type: CREATE_ONE_WAITING,
  };
};
const createOneSuccess = () => {
  return {
    type: CREATE_ONE_SUCCESS,
  };
};
const createOneFailure = (error) => {
  return {
    type: CREATE_ONE_FAILURE,
    error,
  };
};
export const createOneRequest = (shop) => {
  return (dispatch) => {
    dispatch(loader.on());
    dispatch(createOneWaiting());
    return fetch(`${configure.API}/shop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: shop,
      }),
    })
      .then((res) => {
        dispatch(loader.off());
        if (res.ok) { return res.json(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then((res) => {
        if (res.data) {
          return dispatch(createOneSuccess(res.data));
        }
        return dispatch(createOneFailure({
          error: null,
          message: 'response에 data 프로퍼티가 없습니다.'
        }));
      })
      .catch(e => dispatch(createOneFailure(e)));
  };
};
const removeOneWaiting = () => {
  return {
    type: REMOVE_ONE_WAITING,
  };
};
const removeOneSuccess = () => {
  return {
    type: REMOVE_ONE_SUCCESS,
  };
};
const removeOneFailure = (error) => {
  return {
    type: REMOVE_ONE_FAILURE,
    error,
  };
};
export const removeOneRequest = (shop) => {
  return (dispatch) => {
    dispatch(loader.on());
    dispatch(removeOneWaiting());
    return fetch(`${configure.API}/shop`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: shop,
      }),
    })
      .then((res) => {
        dispatch(loader.off());
        if (res.ok) { return res.json(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then((res) => {
        if (res.data) {
          return dispatch(removeOneSuccess(res.data));
        }
        return dispatch(removeOneFailure({
          error: null,
          message: 'response에 data 프로퍼티가 없습니다.'
        }));
      })
      .catch(e => dispatch(removeOneFailure(e)));
  };
};
const removeManyWaiting = () => {
  return {
    type: REMOVE_MANY_WAITING,
  };
};
const removeManySuccess = () => {
  return {
    type: REMOVE_MANY_SUCCESS,
  };
};
const removeManyFailure = (error) => {
  return {
    type: REMOVE_MANY_FAILURE,
    error,
  };
};
export const removeManyRequest = (shops) => {
  return (dispatch) => {
    dispatch(loader.on());
    dispatch(removeManyWaiting());
    return fetch(`${configure.API}/shop`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: shops,
      }),
    })
      .then((res) => {
        dispatch(loader.off());
        if (res.ok) { return res.json(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then((res) => {
        if (res.data) {
          return dispatch(removeManySuccess(res.data));
        }
        return dispatch(removeManyFailure({
          error: null,
          message: 'response에 data 프로퍼티가 없습니다.'
        }));
      })
      .catch(e => dispatch(removeManyFailure(e)));
  };
};
