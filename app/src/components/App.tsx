import React from 'react';
import { useSoot } from '../context/Soot';
import { Login } from './Auth/Login';
import { Navigation } from './Layout/Navigation';

export const App: React.FC = () => {
  const { sootRegistryFacade } = useSoot();

  return sootRegistryFacade ? <Navigation /> : <Login />;
};
