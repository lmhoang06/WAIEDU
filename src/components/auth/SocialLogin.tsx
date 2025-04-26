import React from 'react';
import '../../styles/auth/SocialLogin.css';

interface SocialLoginProps {
  disabled?: boolean;
}

// Using underscore prefix to indicate intentionally unused parameter
const SocialLogin: React.FC<SocialLoginProps> = ({ disabled: _disabled = false }) => {
  // @ts-ignore - will be used when social login is implemented
  const handleGoogleLogin = () => {
    // Will be implemented later with Firebase or OAuth
    console.log('Google login clicked');
    alert('Google login will be integrated soon');
  };

  // @ts-ignore - will be used when social login is implemented
  const handleFacebookLogin = () => {
    // Will be implemented later with Firebase or OAuth
    console.log('Facebook login clicked');
    alert('Facebook login will be integrated soon');
  };

  // Temporarily return null to hide social login buttons
  // Will be re-enabled once OAuth integration is complete
  return null;
  
  /* Original implementation - commented out temporarily
  return (
    <div className="social-login-container">
      <button 
        type="button" 
        className="social-login-button"
        onClick={handleGoogleLogin}
        disabled={_disabled}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#4285F4">
          <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
        </svg>
        <span>Google</span>
      </button>
      <button 
        type="button" 
        className="social-login-button"
        onClick={handleFacebookLogin}
        disabled={_disabled}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-5.8-4.698-10.5-10.498-10.5s-10.5 4.7-10.5 10.5c0 5.243 3.84 9.583 8.86 10.37v-7.337h-2.668v-3.033h2.668V9.74c0-2.633 1.568-4.085 3.966-4.085 1.15 0 2.35.205 2.35.205v2.584h-1.322c-1.304 0-1.712.81-1.712 1.64v1.97h2.912l-.465 3.032H16.14v7.337c5.02-.787 8.86-5.127 8.86-10.37"/>
        </svg>
        <span>Facebook</span>
      </button>
    </div>
  );
  */
};

export default SocialLogin;