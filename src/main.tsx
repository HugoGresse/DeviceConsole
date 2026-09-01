import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { App as AntApp } from 'antd'
import { BrowserRouter } from 'react-router'

import { store } from './core/store'
import { observeAuth } from './core/auth/auth-thunks'
import { AppRoutes } from './routes'

import './index.css'

void observeAuth(store.dispatch)

const container = document.getElementById('root')
if (!container) throw new Error('Root container is missing from index.html')

createRoot(container).render(
  <StrictMode>
    <Provider store={store}>
      <AntApp>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AntApp>
    </Provider>
  </StrictMode>,
)
