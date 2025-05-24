import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { Box } from '@chakra-ui/react';

function PrivateRoute({ children }) {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    // Redirect to login while saving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Box pt="60px">
      {children}
    </Box>
  );
}

export default PrivateRoute; 