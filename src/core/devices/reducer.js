import { Record, List } from 'immutable';

import {
    REGISTER_ERROR,
    REGISTER_SUCCESS,
    UNREGISTER_SUCCESS,
    UNREGISTER_ERROR,
    LOAD_DEVICES_SUCCESS,
    NOTIFICATION_RECEIVED
} from './action-types';

import { NotificationRecord } from './notification';
import { readDeviceUuidCookie } from '../utils';

export const DevicesState = new Record({
    list: new List(),
    notification: null,
    filter: '',
    error: null,
    isRegistered: false
});


export function devicesReducer(state = getInitialState(), { payload, type }) {
    switch (type) {
        case REGISTER_SUCCESS:
            return state.merge({
                list: state.deleted && state.deleted.key === payload.key ?
                    state.previous :
                    setItIsMe(state.list.unshift(payload), readDeviceUuidCookie('uuid')),
                isRegistered: !!readDeviceUuidCookie('uuid')
            });
        case LOAD_DEVICES_SUCCESS:
            return state.set('list',
                new List(
                    setItIsMe(payload.sort((a, b) => {
                        return b.updatedAt - a.updatedAt;
                    }), readDeviceUuidCookie('uuid'))
                )
            );
        case UNREGISTER_SUCCESS:
            return new DevicesState();
        case UNREGISTER_ERROR:
        case REGISTER_ERROR:
            return state.merge({
                error: payload.message
            })
        case NOTIFICATION_RECEIVED:
            return state.set('notification', new NotificationRecord(payload));
        default:
            return state;
    }
}

function getInitialState() {
    const deviceUuidCookie = readDeviceUuidCookie('uuid');
    const state = new DevicesState();
    return state.set('isRegistered', !!deviceUuidCookie);
}

function setItIsMe(deviceList, deviceUuid) {
    return deviceList.map(device => {
        return (deviceUuid === device.key) ? device.set('itIsMe', true) : device
    });
}