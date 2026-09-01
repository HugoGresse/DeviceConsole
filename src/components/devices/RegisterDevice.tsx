import { useState } from 'react'
import { RightCircleOutlined } from '@ant-design/icons'
import { Button, Col, Input, Modal, Row } from 'antd'

import { useAppDispatch, useAppSelector } from '../../core/hooks'
import { selectUser } from '../../core/auth/auth-slice'
import { selectCurrentDevice, selectIsRegistered } from '../../core/devices/devices-slice'
import { refreshMessagingToken, registerDevice } from '../../core/devices/devices-thunks'
import { currentDeviceDescription } from '../../core/utils/device-name'

export function RegisterDevice() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const isRegistered = useAppSelector(selectIsRegistered)
  const currentDevice = useAppSelector(selectCurrentDevice)

  const [description] = useState(currentDeviceDescription)
  const [deviceName, setDeviceName] = useState(description.name)

  const needsToken = currentDevice !== null && currentDevice.deviceRegistrationToken === null

  const register = () => {
    if (!user || !deviceName.trim()) return
    void dispatch(registerDevice(user.id, deviceName.trim(), description.os))
  }

  return (
    <div style={{ marginTop: '16px' }}>
      {!isRegistered && (
        <Row>
          <Col span={24}>Register this device</Col>
          <Col xs={24} sm={12}>
            <Input
              value={deviceName}
              onChange={(event) => setDeviceName(event.target.value)}
              onPressEnter={register}
              addonAfter={
                <Button
                  type="text"
                  icon={<RightCircleOutlined />}
                  onClick={register}
                  aria-label="Register"
                />
              }
            />
          </Col>
        </Row>
      )}

      <Modal
        open={needsToken}
        title="Your device is not fully registered"
        okText="Retry"
        cancelText="Discard"
        onOk={() => user && dispatch(refreshMessagingToken(user.id))}
        onCancel={() => {}}
        closable={false}
      >
        <p>
          This device has no notification token yet. Allow browser notifications, then retry to
          finish registration.
        </p>
      </Modal>
    </div>
  )
}
