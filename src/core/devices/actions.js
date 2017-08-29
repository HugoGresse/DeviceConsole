import firebase from 'firebase';
import { firebaseMessaging } from '../firebase';
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
    UPDATE_DEVICES_SUCCESS,
    NOTIFICATION_ERROR,
    NOTIFICATION_SUCCESS,
    UPDATE_DEVICE_TOKEN_SUCCESS,
    UPDATE_DEVICE_TOKEN_ERROR,
    NOTIFICATION_RECEIVED
} from './action-types';
import { createDeviceUuidCookie } from '../utils';

const devicePath = "devices"

export function createDevice(uid, name, os) {
    return dispatch => {
        // Create device uuid and save it for 5 years
        const deviceUuid = uuidv4();
        createDeviceUuidCookie(deviceUuid, 1825);

        deviceList.path = uid + '/' + devicePath;
        deviceList.update(deviceUuid, {
            name: name,
            os: os,
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        }).then(function () {
            console.info('Device created');
            dispatch(requestNotificationPermission(uid, deviceUuid));
        }).catch(error => dispatch(createDeviceError(error)));
    };
}

export function createDeviceError(error) {
    return {
        type: REGISTER_ERROR,
        payload: error
    };
}

export function createDeviceSuccess(device) {

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

export function updateDeviceTokenSuccess(payload) {
    return {
        type: UPDATE_DEVICE_TOKEN_SUCCESS,
        payload: payload
    };
}

export function updateDeviceTokenError(error) {
    return {
        type: UPDATE_DEVICE_TOKEN_ERROR,
        payload: error
    };
}




/////////////////////// NOTIFICATION

export function sendNotification(device) {
    return dispatch => {
        deviceList.remove(device.key)
            .catch(error => dispatch(sendNotificationError(error)));
    };
}

export function sendNotificationError(error) {
    return {
        type: NOTIFICATION_ERROR,
        payload: error
    };
}

export function sendNotificationSuccess(device) {
    return {
        type: NOTIFICATION_SUCCESS,
        payload: device
    };
}

function notificationReceived(payload) {
    return {
        type: NOTIFICATION_RECEIVED,
        payload: payload
    };
}

function requestNotificationPermission(uid, deviceUuid) {
    console.log('requestNotificationPermission')
    return dispatch => {
        firebaseMessaging.requestPermission()
            .then(function () {
                console.info('Notification permission granted.');
                dispatch(getAndUpdateToken(uid, deviceUuid));
            })
            .catch(function (error) {
                console.log('requestNotificationPermission error', error)
                dispatch(createDeviceError('Unable to get permission to notify. ' + error))
            });
    }
}

function getAndUpdateToken(uid, deviceUuid) {
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    return dispatch => {
        firebaseMessaging.getToken()
            .then(function (currentToken) {
                if (currentToken) {
                    // Update device registration on firebase
                    let changes = {};
                    changes['updatedAt'] = firebase.database.ServerValue.TIMESTAMP;
                    changes['deviceRegistrationToken'] = currentToken;

                    deviceList.path = uid + '/' + devicePath;
                    deviceList.update(deviceUuid, changes)
                        .catch(error => dispatch(updateDeviceTokenError(error)));

                } else {
                    // Show permission request.
                    console.error('No Instance ID token available. Request permission to generate one.');
                    // Show permission UI.
                    dispatch(requestNotificationPermission(uid, deviceUuid));
                }
            })
            .catch(function (error) {
                console.error('An error occurred while retrieving token. ', error);
                dispatch(updateDeviceTokenError(error))
            });
    }
}

export function monitorTokenRefresh() {
    return dispatch => {
        // Callback fired if Instance ID token is updated.
        firebaseMessaging.onTokenRefresh(function () {
            console.log('onTokenRefresh.');
            dispatch(getAndUpdateToken());
        });
    }
}

export function listenNotification() {
    return dispatch => {
        firebaseMessaging.onMessage(function (payload) {
            console.info("Message received. ", payload.notification);
            dispatch(notificationReceived(payload.notification));
        });
    }
}