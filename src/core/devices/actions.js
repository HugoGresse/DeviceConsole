import firebase from 'firebase';
import {firebaseMessaging} from '../firebase';
import uuidv4 from 'uuid/v4';
import {deviceList} from './device-list';
import {
    REGISTER_ERROR,
    REGISTER_SUCCESS,
    UNREGISTER_ERROR,
    LOAD_DEVICES_SUCCESS,
    LOAD_DEVICE_SUCCESS,
    UPDATE_DEVICE_SUCCESS,
    UPDATE_DEVICES_SUCCESS,
    NOTIFICATION_ERROR,
    NOTIFICATION_SUCCESS,
    NOTIFICATION_SENDING,
    UPDATE_DEVICE_TOKEN_SUCCESS,
    UPDATE_DEVICE_TOKEN_ERROR,
    NOTIFICATION_RECEIVED,
    UNLOAD_DEVICES_DONE,
    DELETE_DEVICE_SUCCESS
} from './action-types';
import {createDeviceUuidCookie, readDeviceUuidCookie, eraseDeviceUuidCookie} from '../utils';

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
            dispatch(requestNotificationPermission(uid));
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
        if (readDeviceUuidCookie() === device.key) {
            // Delete the uuid of the current device, it has been deleted remotely
            eraseDeviceUuidCookie()
        }
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
        type: DELETE_DEVICE_SUCCESS,
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

export function unloadDevices() {
    return {
        type: UNLOAD_DEVICES_DONE
    };
}

export function setDeviceName(key, name) {
    return dispatch => {
        deviceList.update(key, {
            name: name,
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        })
    }
}


/////////////////////// NOTIFICATION

export function sendNotification(device, content) {
    return dispatch => {
        dispatch(sendingNotification(device.key));
        fetch('https://us-central1-deviceconsole-aa589.cloudfunctions.net/notify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: device.deviceRegistrationToken,
                title: content,
                link: content
            })
        })
            .then(function (response) {
                dispatch(sendNotificationSuccess(device.key));
            }).catch(function (error) {
            dispatch(sendNotificationError(device.key, error));
        });
    }
}

export function sendingNotification(targetDeviceUuid) {
    return {
        type: NOTIFICATION_SENDING,
        payload: {
            deviceUuid: targetDeviceUuid
        }
    };
}

export function sendNotificationError(targetDeviceUuid, error) {
    return {
        type: NOTIFICATION_ERROR,
        payload: {
            deviceUuid: targetDeviceUuid,
            error: error
        }
    };
}

export function sendNotificationSuccess(targetDeviceUuid) {
    return {
        type: NOTIFICATION_SUCCESS,
        payload: {
            deviceUuid: targetDeviceUuid
        }
    };
}

function notificationReceived(payload) {
    return {
        type: NOTIFICATION_RECEIVED,
        payload: payload
    };
}

export function requestNotificationPermission(uid) {
    console.log('requestNotificationPermission')
    return dispatch => {
        firebaseMessaging.requestPermission()
            .then(function () {
                console.info('Notification permission granted.');
                dispatch(getAndUpdateToken(uid));
            })
            .catch(function (error) {
                console.log('requestNotificationPermission error', error)
                dispatch(createDeviceError('Unable to get permission to notify. ' + error))
            });
    }
}

export function getAndUpdateToken(uid) {
    const deviceUuid = readDeviceUuidCookie();
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
                    dispatch(requestNotificationPermission(uid));
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
            console.info('onTokenRefresh');
            dispatch(getAndUpdateToken(readDeviceUuidCookie()));
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
