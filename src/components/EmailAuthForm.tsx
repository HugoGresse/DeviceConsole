import { useState } from 'react'
import { App as AntApp, Button, Form, Input, Typography } from 'antd'

import { authErrorCleared } from '../core/auth/auth-slice'
import { sendPasswordReset, signInWithEmail, signUpWithEmail } from '../core/auth/auth-thunks'
import { useAppDispatch } from '../core/hooks'

type Mode = 'signin' | 'signup'

const normalizeEmail = (value: string) => value.trim().toLowerCase()

interface Credentials {
  email: string
  password: string
}

export function EmailAuthForm() {
  const dispatch = useAppDispatch()
  const { message } = AntApp.useApp()
  const [form] = Form.useForm<Credentials>()

  const [mode, setMode] = useState<Mode>('signin')
  const [submitting, setSubmitting] = useState(false)
  const [resetting, setResetting] = useState(false)

  const submit = async ({ email, password }: Credentials) => {
    setSubmitting(true)
    const signIn = mode === 'signin' ? signInWithEmail : signUpWithEmail
    await dispatch(signIn(normalizeEmail(email), password))
    setSubmitting(false)
  }

  const switchMode = () => {
    dispatch(authErrorCleared())
    setMode((current) => (current === 'signin' ? 'signup' : 'signin'))
  }

  const resetPassword = async () => {
    let email: string
    try {
      ;({ email } = await form.validateFields(['email']))
    } catch {
      return
    }

    setResetting(true)
    const result = await dispatch(sendPasswordReset(normalizeEmail(email)))
    setResetting(false)

    if (result.ok) message.success(`Password reset email sent to ${normalizeEmail(email)}`)
  }

  return (
    <Form form={form} layout="vertical" onFinish={submit} style={{ textAlign: 'left' }}>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Enter your email' },
          { type: 'email', message: 'That email address is not valid' },
        ]}
      >
        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="you@example.com"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Enter your password' },
          { min: 6, message: 'Passwords must be at least 6 characters' },
        ]}
      >
        <Input.Password
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={submitting} block>
        {mode === 'signin' ? 'Sign in' : 'Create account'}
      </Button>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <Typography.Link onClick={switchMode}>
          {mode === 'signin' ? 'Create an account' : 'I already have an account'}
        </Typography.Link>

        {mode === 'signin' && (
          <Button type="link" size="small" loading={resetting} onClick={resetPassword} style={{ padding: 0 }}>
            Forgot password?
          </Button>
        )}
      </div>
    </Form>
  )
}
