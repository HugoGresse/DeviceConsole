import { useEffect, useState } from 'react'
import { DeleteOutlined, RightCircleOutlined } from '@ant-design/icons'
import { Button, Col, Input, Popconfirm, Row, Tooltip, Typography } from 'antd'

import { formatAbsoluteTime, formatRelativeTime } from '../../core/utils/relative-time'
import type { Device } from '../../core/devices/types'

interface DeviceItemProps {
  device: Device
  isCurrentDevice: boolean
  sending: boolean
  onSend: (device: Device, message: string) => void
  onRename: (key: string, name: string) => void
  onDelete: (device: Device) => void
}

export function DeviceItem({
  device,
  isCurrentDevice,
  sending,
  onSend,
  onRename,
  onDelete,
}: DeviceItemProps) {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!sending) setMessage('')
  }, [sending])

  const send = () => {
    if (!message.trim()) return
    onSend(device, message)
  }

  return (
    <Row className="data-row">
      <Col xs={24} sm={10}>
        <Typography.Text editable={{ onChange: (name) => onRename(device.key, name) }}>
          {device.name}
        </Typography.Text>
        {isCurrentDevice && ' (me)'}
      </Col>

      <Col xs={24} sm={4}>
        {device.updatedAt && (
          <Tooltip title={formatAbsoluteTime(device.updatedAt)}>
            {formatRelativeTime(device.updatedAt)}
          </Tooltip>
        )}
      </Col>

      <Col xs={24} sm={10}>
        <Row>
          <Col xs={24} sm={16} className="inputWithButton">
            <Input
              placeholder="Send a link"
              disabled={sending}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onPressEnter={send}
              addonAfter={
                <Button
                  loading={sending}
                  icon={<RightCircleOutlined />}
                  onClick={send}
                  aria-label="Send"
                />
              }
            />
          </Col>
          <Col xs={24} sm={{ span: 2, offset: 6 }} className="topMarginSm">
            <Popconfirm
              title="Are you sure to remove this device?"
              onConfirm={() => onDelete(device)}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button type="primary" shape="circle" icon={<DeleteOutlined />} aria-label="Delete" />
            </Popconfirm>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
