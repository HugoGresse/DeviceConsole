import { Button, Col, Divider, Layout, Row } from 'antd'

import { selectAuthError } from '../core/auth/auth-slice'
import { signInWithGoogle } from '../core/auth/auth-thunks'
import { useAppDispatch, useAppSelector } from '../core/hooks'
import { EmailAuthForm } from './EmailAuthForm'
import { Footer } from './Footer'

const { Content } = Layout

export function Login() {
  const dispatch = useAppDispatch()
  const error = useAppSelector(selectAuthError)

  return (
    <Layout>
      <Layout>
        <Content style={{ textAlign: 'center' }}>
          <Row justify="center" style={{ background: '#fff', padding: 24 }}>
            <Col xs={24} sm={16} md={10}>
              <h1>
                <i className="material-icons" style={{ fontSize: '40px', marginTop: '10px' }}>
                  touch_app
                </i>
                <span>DeviceConsole</span>
              </h1>

              <EmailAuthForm />

              <Divider plain>or</Divider>

              <Button onClick={() => dispatch(signInWithGoogle())} block>
                Continue with Google
              </Button>

              <div className="error">{error ?? ''}</div>
            </Col>
          </Row>

          <Row justify="center" align="middle" style={{ background: '#fff', padding: 24 }}>
            <Col span={24}>
              <h2>DeviceConsole is a fast way to share a text/url to one device of a fleet.</h2>
              <p style={{ fontSize: '14px' }}>
                It is a free &amp; open source software that allows a single account to:
              </p>
              <ul>
                <li>- register many devices through modern browsers supporting service workers</li>
                <li>- send text or urls to these devices</li>
              </ul>
            </Col>
          </Row>
        </Content>
      </Layout>
      <Footer />
    </Layout>
  )
}
