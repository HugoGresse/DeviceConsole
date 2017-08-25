import firebase from 'firebase';
import uuidv4 from 'uuid/v4';
import { deviceList } from './device-list';
import {
  REGISTER_ERROR,
  REGISTER_SUCCESS,
  UNREGISTER_SUCCESS,
  UNREGISTER_ERROR,
  LOAD_DEVICES_SUCCESS,
  LOAD_DEVICE_SUCCESS,
  UPDATE_DEVICE_SUCCESS,
  UPDATE_DEVICES_SUCCESS
} from './action-types';
import {createCookie} from './utils';

const devicePath = "devices"

export function createDevice(uid, name) {
  return dispatch => {

    const uuid = uuidv4();

    deviceList.path = uid + '/' + devicePath;
    deviceList.update(uuid, {
      'name': name,
      'updatedAt': firebase.database.ServerValue.TIMESTAMP
    }).catch(error => console.error(error));
  };
}

export function createDeviceError(error) {
  return {
    type: REGISTER_ERROR,
    payload: error
  };
}

export function createDeviceSuccess(device) {
  // Save uuid for 5 years
  createCookie('uuid', device.key, 1825);

  return {
    type: REGISTER_SUCCESS,
    payload: device
  };
}

export function deleteDevice(device) {
  return dispatch => {
    deviceList.remove(device.key)
      .catch(error => dispatch(deleteDeviceError(error)));
  };
}

export function deleteDeviceError(error) {
  return {
    type: UNREGISTER_ERROR,
    payload: error
  };
}

export function deleteDeviceSuccess(device) {
  return {
    type: UNREGISTER_SUCCESS,
    payload: device
  };
}

export function loadDeviceSuccess(device) {
  return {
    type: LOAD_DEVICE_SUCCESS,
    payload: device
  };
}

export function loadDevicesSuccess(device) {
  return {
    type: LOAD_DEVICES_SUCCESS,
    payload: device
  };
}

export function loadDevices(uid) {
  return (dispatch, getState) => {
    deviceList.path = uid + '/' + devicePath;
    deviceList.subscribe(dispatch);
  };
}

export function updateDeviceSuccess(device) {
  return {
    type: UPDATE_DEVICE_SUCCESS,
    payload: device
  };
}
export function updateDevicesSuccess(device) {
  return {
    type: UPDATE_DEVICES_SUCCESS,
    payload: device
  };
}