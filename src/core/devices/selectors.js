import { createSelector } from 'reselect';

export function getDevices(state) {
  return state.devices.list;
}
