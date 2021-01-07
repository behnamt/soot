import React from 'react';
import { useWeb3 } from '../context/Web3';
import { Login } from './Auth/Login';
import { Navigation } from './Layout/Navigation';

export const Root: React.FC = () => {
  const { account } = useWeb3();

  return (
      account ? <Navigation /> : <Login />
  );
};
