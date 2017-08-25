import { Record, List } from 'immutable';

import {
    REGISTER_ERROR,
    REGISTER_SUCCESS,
    UNREGISTER_SUCCESS,
    UNREGISTER_ERROR,
    LOAD_DEVICES_SUCCESS
} from './action-types';

import { readCookie } from './utils';

export const DevicesState = new Record({
    list: new List(),
    filter: '',
    error: null
});


export function devicesReducer(state = new DevicesState(), { payload, type }) {
    const uuidFromCookie = readCookie('uuid');

    switch (type) {
        case REGISTER_SUCCESS:
            return state.merge({
                list: state.deleted && state.deleted.key === payload.key ?
                    state.previous :
                    state.list.unshift(payload.set('itIsMe', (payload.key === uuidFromCookie) ? true: false))
            });
        case LOAD_DEVICES_SUCCESS:
            return state.set('list',
                new List(
                    payload.sort((a, b) => {
                        return b.updatedAt - a.updatedAt;
                    }).map(device => {
                        device = (uuidFromCookie === device.key) ? device.set('itIsMe', true) : device;
                        return device
                    })
                )
            );
        case UNREGISTER_SUCCESS:
            return new DevicesState();
        case UNREGISTER_ERROR:
        case REGISTER_ERROR:
            return state.merge({
                error: payload.message
            })
        default:
            return state;
    }
}
