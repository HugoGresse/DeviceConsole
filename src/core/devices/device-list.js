import { FirebaseList, FirebaseItem } from '../firebase';
import * as deviceActions from './actions';
import { Device } from './device';


export const deviceList = new FirebaseList({
  onAdd: deviceActions.createDeviceSuccess,
  onChange: deviceActions.updateDevicesSuccess,
  onLoad: deviceActions.loadDevicesSuccess,
  onRemove: deviceActions.deleteDeviceSuccess
}, Device);

export const deviceItem = new FirebaseItem({
  onAdd: deviceActions.createDeviceSuccess,
  onChange: deviceActions.updateDeviceSuccess,
  onLoad: deviceActions.loadDeviceSuccess,
  onRemove: deviceActions.deleteDeviceSuccess
}, Device);
