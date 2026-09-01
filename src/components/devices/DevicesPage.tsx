import { useEffect } from 'react'
import { App as AntApp, Button, Col, Row } from 'antd'

import { selectUser } from '../../core/auth/auth-slice'
import {
  errorCleared,
  selectCurrentDeviceUuid,
  selectDeviceList,
  selectDevicesError,
  selectNotification,
  selectSendingByKey,
} from '../../core/devices/devices-slice'
import {
  deleteDevice,
  listenForNotifications,
  loadDevices,
  renameDevice,
  sendNotification,
} from '../../core/devices/devices-thunks'
import { useAppDispatch, useAppSelector } from '../../core/hooks'
import { DeviceList } from './DeviceList'
import { RegisterDevice } from './RegisterDevice'

export function DevicesPage() {
  const dispatch = useAppDispatch()
  const { notification: notify } = AntApp.useApp()

  const user = useAppSelector(selectUser)
  const devices = useAppSelector(selectDeviceList)
  const currentDeviceUuid = useAppSelector(selectCurrentDeviceUuid)
  const sendingByKey = useAppSelector(selectSendingByKey)
  const incoming = useAppSelector(selectNotification)
  const error = useAppSelector(selectDevicesError)

  const uid = user?.id

  useEffect(() => {
    if (!uid) return
    return dispatch(loadDevices(uid))
  }, [dispatch, uid])

  useEffect(() => {
    const pending = dispatch(listenForNotifications())
    return () => {
      void pending.then((unsubscribe) => unsubscribe())
    }
  }, [dispatch])

  useEffect(() => {
    if (!incoming) return
    notify.open({
      message: incoming.title ?? 'Notification',
      description: incoming.body,
      icon: incoming.icon ? <img src={incoming.icon} alt="" /> : undefined,
      btn: incoming.link ? (
        <Button type="primary" size="small" onClick={() => window.open(incoming.link!, '_blank')}>
          Open
        </Button>
      ) : undefined,
      duration: 15,
    })
  }, [incoming, notify])

  useEffect(() => {
    if (!error) return
    notify.error({ message: error, duration: 15 })
    dispatch(errorCleared())
  }, [error, notify, dispatch])

  return (
    <Row>
      <Col span={24}>
        <h1>Devices</h1>
        <RegisterDevice />
        <br />
        <DeviceList
          devices={devices}
          currentDeviceUuid={currentDeviceUuid}
          sendingByKey={sendingByKey}
          onSend={(device, message) => void dispatch(sendNotification(device, message))}
          onRename={(key, name) => uid && void dispatch(renameDevice(uid, key, name))}
          onDelete={(device) => uid && void dispatch(deleteDevice(uid, device))}
        />
      </Col>
    </Row>
  )
}
