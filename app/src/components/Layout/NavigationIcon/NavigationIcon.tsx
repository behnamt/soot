import React from 'react';
import { IconButton, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface NavigationIconProps {
  link: string;
  label: string;
  icon: React.ReactNode;
}

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  text-decoration: none;

  button {
    width: 50px;
    margin: 0 auto;
  }
`;

export const NavigationIcon: React.FC<NavigationIconProps> = (props: NavigationIconProps) => {
  const { icon, label, link } = props;

  return (
    <StyledLink to={link} className="navigation-icon">
      <IconButton>{icon}</IconButton>
      <Typography variant="caption">{label}</Typography>
    </StyledLink>
  );
};
