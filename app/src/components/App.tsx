import React from 'react';
import { useSoot } from '@contexts/Soot';
import { Login } from '@organisms/Login/Login';
import { Navigation } from '@organisms/Navigation/Navigation';

export const App: React.FC = () => {
  const { sootRegistryFacade } = useSoot();

  return sootRegistryFacade ? <Navigation /> : <Login />;
};
