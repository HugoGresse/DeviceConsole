import { Navigate, Outlet, Route, Routes } from 'react-router'
import { Spin } from 'antd'

import { useAppSelector } from './core/hooks'
import { selectAuthInitialized, selectIsAuthenticated } from './core/auth/auth-slice'
import { AppLayout } from './components/AppLayout'
import { Login } from './components/Login'
import { DevicesPage } from './components/devices/DevicesPage'

function AuthGate({ authenticated, redirectTo }: { authenticated: boolean; redirectTo: string }) {
  const initialized = useAppSelector(selectAuthInitialized)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (!initialized) return <Spin fullscreen />
  return isAuthenticated === authenticated ? <Outlet /> : <Navigate to={redirectTo} replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthGate authenticated={false} redirectTo="/" />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<AuthGate authenticated redirectTo="/login" />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="devices" replace />} />
          <Route path="devices" element={<DevicesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
