import {ADD_ALERT, DELETE_ALERT} from '../constants/Actions';

function showAlert(alert) {
  return {
    type: ADD_ALERT,
    alert: alert,
  };
}

export function addAlert(type, title, message) {
  return function(dispatch) {
    return dispatch(showAlert({type, title, message}));
  };
}

function hideAlert(alert) {
  return {
    type: DELETE_ALERT,
  };
}

export function deleteAlert() {
  return function(dispatch) {
    return dispatch(hideAlert());
  };
}