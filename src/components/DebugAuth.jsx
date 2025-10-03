import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const DebugAuth = () => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔍 DEBUG - Auth State:', { 
      user, 
      loading, 
      token: token ? 'EXISTS' : 'MISSING',
      tokenLength: token ? token.length : 0
    });

    // Test the token directly
    if (token && !user && !loading) {
      console.log('🔍 DEBUG - Token exists but user is null, testing token...');
      testToken(token);
    }
  }, [user, loading]);

  const testToken = async (token) => {
    try {
      const response = await fetch('https://teamflow-1yai.onrender.com/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('🔍 DEBUG - Token test response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🔍 DEBUG - Token test success:', data);
      } else {
        const errorText = await response.text();
        console.log('🔍 DEBUG - Token test failed:', errorText);
      }
    } catch (error) {
      console.error('🔍 DEBUG - Token test error:', error);
    }
  };

  return null;
};

export default DebugAuth;