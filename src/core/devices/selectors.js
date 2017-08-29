import { createSelector } from 'reselect';

export function getDevices(state) {
  return state.devices.list;
}

export function isRegistered(state) {
  return state.devices.isRegistered;
}

export function getNotification(state) {
  return state.devices.notification;
}
