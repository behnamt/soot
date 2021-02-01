import React from 'react';
import { Button, CircularProgress, Box, ButtonProps } from '@material-ui/core';
import styled from 'styled-components';

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
  onClick(): void;
}

const StyledCircularProgress = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
`;

export const LoadingButton: React.FC<LoadingButtonProps> = (props: LoadingButtonProps) => {
  const { children, disabled, loading, onClick, ...parentProps } = props;

  return (
    <Box position="relative">
      <Button onClick={onClick} disabled={loading || disabled} {...parentProps}>
        {children}
      </Button>
      {loading && <StyledCircularProgress size={24} />}
    </Box>
  );
};
