/* global fetch */
import configure from '../../modules/configure';
import * as loader from '../loader/actions';

export const WAITING = 'data/logout/WAITING';
export const SUCCESS = 'data/logout/SUCCESS';
export const FAILURE = 'data/logout/FAILURE';

const waiting = () => {
  return {
    type: WAITING,
  };
};
const success = (user) => {
  return {
    type: SUCCESS,
    user,
  };
};
const failure = (error) => {
  return {
    type: FAILURE,
    error,
  };
};
export const request = () => {
  return (dispatch) => {
    dispatch(loader.on());
    dispatch(waiting());
    return fetch(`${configure.SERVER}/auth/logout`, {
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
          return dispatch(success(res.data));
        }
        return dispatch(failure({
          error: null,
          message: 'response에 data 프로퍼티가 없습니다.'
        }));
      })
      .catch(e => dispatch(failure(e)));
  };
};
