import { GithubOutlined } from '@ant-design/icons'
import { Layout } from 'antd'

export function Footer() {
  return (
    <Layout.Footer style={{ textAlign: 'center' }}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/HugoGresse/DeviceConsole"
        style={{ color: '#222' }}
      >
        <GithubOutlined style={{ fontSize: 20 }} />
      </a>
    </Layout.Footer>
  )
}
