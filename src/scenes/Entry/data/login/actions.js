/* global fetch */
export const WAITING = 'Entry/data/login/WAITING';
export const SUCCESS = 'Entry/data/login/SUCCESS';
export const FAILURE = 'Entry/data/login/FAILURE';

const waiting = () => {
  return {
    type: WAITING,
  };
};
const success = () => {
  return {
    type: SUCCESS,
  };
};
const failure = (error) => {
  return {
    type: FAILURE,
    error,
  };
};
export const request = (input) => {
  return (dispatch) => {
    dispatch(waiting());
    return fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: input,
      }),
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
