import { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const GoogleLoginButton = ({ setError, setIsLoading, disabled = false }) => {
  const { loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleSuccess = async (credentialResponse) => {
    if (disabled) {
      return;
    }

    if (!credentialResponse?.credential) {
      setError?.('Google did not return a sign-in credential. Please try again.');
      return;
    }

    setError?.(null);
    setIsLoading?.(true);

    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError?.(err.response?.data?.message || 'Google login failed. Please try again.');
    } finally {
      setIsLoading?.(false);
    }
  };

  if (!googleClientId) {
    return (
      <button
        type="button"
        disabled
        title="Set VITE_GOOGLE_CLIENT_ID to enable Google login"
        className="w-full py-3.5 text-sm font-bold"
        style={{
          borderRadius: '16px',
          border: '1.5px solid #d1fae5',
          color: '#12343B',
          background: '#f8fffe',
          cursor: 'not-allowed',
          opacity: 0.82
        }}
      >
        Continue with Google
      </button>
    );
  }

  return (
    <div
      className={`w-full flex justify-center ${disabled ? 'pointer-events-none opacity-70' : ''}`}
      aria-disabled={disabled}
    >
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => setError?.('Google login failed. Please try again.')}
        text="continue_with"
        shape="pill"
        size="large"
        width="100%"
        useOneTap={false}
        containerProps={{
          style: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }
        }}
      />
    </div>
  );
};

export default GoogleLoginButton;
