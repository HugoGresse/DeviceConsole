import { Dropdown, Layout } from 'antd'
import { Outlet } from 'react-router'

import { selectUser } from '../core/auth/auth-slice'
import { signOutUser } from '../core/auth/auth-thunks'
import { useAppDispatch, useAppSelector } from '../core/hooks'
import { Footer } from './Footer'

const { Header, Content } = Layout

export function AppLayout() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)

  const menuItems = [
    { key: 'email', label: user?.email ?? '', disabled: true },
    { type: 'divider' as const },
    { key: 'logout', label: 'Logout' },
  ]

  return (
    <Layout>
      <Header style={{ textAlign: 'left' }}>
        <i
          className="material-icons"
          style={{ color: 'white', fontSize: '40px', marginTop: '10px' }}
        >
          touch_app
        </i>
        <span style={{ color: 'white' }}>DeviceConsole</span>

        <Dropdown
          trigger={['click']}
          menu={{ items: menuItems, onClick: ({ key }) => key === 'logout' && dispatch(signOutUser()) }}
        >
          <img className="headerAvatar" src={user?.avatar ?? ''} alt="Account menu" />
        </Dropdown>
      </Header>

      <Layout>
        <Content className="content">
          <Outlet />
        </Content>
      </Layout>

      <Footer />
    </Layout>
  )
}
