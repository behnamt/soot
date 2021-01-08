import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

export const MenuBar: React.FC = () => {
  const location = useLocation();
  const [menuName, setMenuName] = useState('');

  useEffect(() => {
    let name = location.pathname;
    switch (location.pathname) {
      case '/':
        name = 'Report a misconduct';
        break;
      case '/locations':
        name = 'Map';
        break;
      case '/messenger':
        name = 'Messenger';
        break;
      case '/incidents':
        name = 'My reports';
        break;

      default:
        break;
    }
    setMenuName(name);
  }, [location.pathname]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" align="center">
          {menuName}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
