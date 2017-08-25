import { isAuthenticated } from './core/auth';

export const requireAuth = getState => {
  return (params, replace) => {
    if (!isAuthenticated(getState())) {
      replace('/login');
    }
  };
};

export const requireUnauth = getState => {
  return (params, replace) => {
    if (isAuthenticated(getState())) {
      replace('/');
    }
  };
};
