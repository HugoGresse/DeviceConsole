import { Record, List } from 'immutable';

import {
    REGISTER_ERROR,
    REGISTER_SUCCESS,
    UNREGISTER_SUCCESS,
    UNREGISTER_ERROR,
    LOAD_DEVICES_SUCCESS,
    UPDATE_DEVICES_SUCCESS,
    NOTIFICATION_RECEIVED,
    NOTIFICATION_SENDING,
    NOTIFICATION_ERROR,
    NOTIFICATION_SUCCESS,
    UNLOAD_DEVICES_DONE,
    DELETE_DEVICE_SUCCESS
} from './action-types';

import { NotificationRecord } from './notification';
import { readDeviceUuidCookie } from '../utils';

export const DevicesState = new Record({
    list: new List(),
    notification: null,
    filter: '',
    error: null,
    isRegistered: false,
    previous: null
});


export function devicesReducer(state = getInitialState(), { payload, type }) {

    switch (type) {
        case REGISTER_SUCCESS:
            return state.merge({
                list: state.deleted && state.deleted.key === payload.key ?
                    state.previous :
                    setItIsMe(state.list.unshift(payload)),
                isRegistered: !!readDeviceUuidCookie('uuid')
            });
        case LOAD_DEVICES_SUCCESS:
            return state.set('list',
                new List(
                    setItIsMe(payload.sort((a, b) => {
                        return b.updatedAt - a.updatedAt;
                    }))
                )
            );
        case UPDATE_DEVICES_SUCCESS:
            return state.merge({
                previous: null,
                list: setItIsMe(state.list.map(device => {
                    return device.key === payload.key ? payload : device;
                }))
            });
        case DELETE_DEVICE_SUCCESS:
            return state.merge({
                previous: state.list,
                isRegistered: !!readDeviceUuidCookie('uuid'),
                list: setItIsMe(state.list.filter(device => device.key !== payload.key))
            });
        case UNREGISTER_SUCCESS:
            return new DevicesState();
        case UNREGISTER_ERROR:
        case REGISTER_ERROR:
            return state.merge({
                error: payload.message
            })
        case NOTIFICATION_SENDING:
            return state.merge({
                previous: state.list,
                list: setItIsMe(state.list.map(device => device.key === payload.deviceUuid ? device.set('sendingNotification', true) : device))
            })
        case NOTIFICATION_SUCCESS:
            return state.merge({
                previous: state.list,
                list: setItIsMe(state.list.map(function (device) {
                    if (device.key === payload.deviceUuid) {
                        return device.set('sendingNotification', false)
                    } else {
                        return device
                    }
                }))
            })
        case NOTIFICATION_ERROR:
            return state.merge({
                previous: state.list,
                error:  payload.error,
                list: setItIsMe(state.list.map(function (device) {
                    if (device.key === payload.deviceUuid) {
                        return device.set('sendingNotification', false)
                    } else {
                        return device
                    }
                }))
            })
        case NOTIFICATION_RECEIVED:
            return state.set('notification', new NotificationRecord(payload));
        case UNLOAD_DEVICES_DONE:
            return getInitialState();
        default:
            return state;
    }
}

function getInitialState() {
    const deviceUuidCookie = readDeviceUuidCookie('uuid');
    const state = new DevicesState();
    return state.set('isRegistered', !!deviceUuidCookie);
}

function setItIsMe(deviceList) {
    const deviceUuid = readDeviceUuidCookie('uuid');
    return deviceList.map(device => {
        return (deviceUuid === device.key) ? device.set('itIsMe', true) : device
    });
}
