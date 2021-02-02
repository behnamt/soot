import React from 'react';
import { useSoot } from '@contexts/Soot';
import { Login } from './Auth/Login/Login';
import { Navigation } from './Navigation/Navigation/Navigation';

export const App: React.FC = () => {
  const { sootRegistryFacade } = useSoot();

  return sootRegistryFacade ? <Navigation /> : <Login />;
};
