import React from 'react';
import { IconButton, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import './NavigationIcon.scss';

interface NavigationIconProps {
  link: string;
  label: string;
  icon: React.ReactNode;
}

export const NavigationIcon: React.FC<NavigationIconProps> = (props: NavigationIconProps) => {
  const { icon, label, link } = props;

  return (
    <Link to={link} className="navigation-icon">
      <IconButton>{icon}</IconButton>
      <Typography variant="caption">{label}</Typography>
    </Link>
  );
};
