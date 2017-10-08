export function getDevices(state) {
  return state.devices.list;
}

export function isRegistered(state) {
  return state.devices.isRegistered;
}

export function getCurrentDevice(state) {
  const deviceListItem = getDevices(state).filter(device => !!device.itIsMe);
  return deviceListItem && deviceListItem.first();
}

export function getNotification(state) {
  return state.devices.notification;
}

export function getError(state) {
    return state.devices.error;
}