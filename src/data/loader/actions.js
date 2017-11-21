/* global fetch */
import configure from '../../modules/configure';

export const WAITING = 'data/auth/WAITING';
export const SUCCESS = 'data/auth/SUCCESS';
export const FAILURE = 'data/auth/FAILURE';

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
    dispatch(waiting());
    return fetch(`${configure.SERVER}/auth`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'pragma': 'no-cache',
        'cache-control': 'no-cache',
      },
    })
      .then((res) => {
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
