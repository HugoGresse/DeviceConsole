import { Col, Row } from 'antd'

import { DeviceItem } from './DeviceItem'
import type { Device } from '../../core/devices/types'

interface DeviceListProps {
  devices: Device[]
  currentDeviceUuid: string | null
  sendingByKey: Record<string, boolean>
  onSend: (device: Device, message: string) => void
  onRename: (key: string, name: string) => void
  onDelete: (device: Device) => void
}

export function DeviceList({
  devices,
  currentDeviceUuid,
  sendingByKey,
  onSend,
  onRename,
  onDelete,
}: DeviceListProps) {
  return (
    <div>
      <Row className="data-row-title">
        <Col span={10}>
          <h3>Name</h3>
        </Col>
        <Col xs={0} sm={4}>
          <h3>Updated</h3>
        </Col>
        <Col xs={0} sm={10}>
          <h3>Action</h3>
        </Col>
      </Row>

      {devices.map((device) => (
        <DeviceItem
          key={device.key}
          device={device}
          isCurrentDevice={device.key === currentDeviceUuid}
          sending={sendingByKey[device.key] ?? false}
          onSend={onSend}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
