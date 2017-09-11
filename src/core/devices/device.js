import { Record } from 'immutable';

export const Device = new Record({
  key: null,
  name: null,
  updatedAt: null,
  createdAt: null,
  itIsMe: false,
  os: null,
  deviceRegistrationToken: null,
  sendingNotification: false,
  sendingNotificationError: null
});
