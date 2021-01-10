import React from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

const HeaderBox = styled.div`
  padding-top: 15px;
  height: 25vh;
  width: 100%;
  background-color: #1d6f6f;
`;

export const LoginHeader: React.FC = () => {
  return (
    <HeaderBox>
      <Typography variant="h1" align="center">
        ĐSoot
      </Typography>
      <Typography variant="h6" align="center">
        A very catchy catch phrase
      </Typography>
    </HeaderBox>
  );
};
