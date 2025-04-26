import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';
import bg1 from '../assets/images/bg1.jpg'; // Using bg1.jpg as background

interface AuthLayoutProps {
  children: React.ReactNode;
  backgroundImage?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, backgroundImage }) => {
  // Apply styles directly to body for full-screen effect
  useEffect(() => {
    // Store original styles
    const originalStyles = {
      overflow: document.body.style.overflow,
      background: document.body.style.background,
      backgroundSize: document.body.style.backgroundSize
    };
    
    // Apply full-screen background
    document.body.style.overflow = 'auto';
    document.body.style.background = `url(${bg1}) no-repeat center center`; // Using bg1.jpg always
    document.body.style.backgroundSize = 'cover';
    
    // Add animation styles
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* Basic animations */
      @keyframes rippleEffect {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      @keyframes buttonPress {
        0% { transform: scale(1); }
        50% { transform: scale(0.97); }
        100% { transform: scale(1); }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
      }
      
      @keyframes gradientFlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      /* Wrapper and main structure */
      .auth-wrapper {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 1;
        justify-content: center;
      }
      
      .auth-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%);
        z-index: 0;
      }
      
      /* Main container styling */
      .auth-main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }
      
      .auth-main-title {
        font-size: 2.5rem;
        color: white;
        text-align: center;
        margin-bottom: 1.5rem;
        text-shadow: 0 2px 10px rgba(0,0,0,0.3);
      }
      
      .auth-content {
        width: 100%;
        max-width: 700px;
      }
      
      .auth-glass-card {
        background-color: rgba(255, 255, 255, 0.65);
        backdrop-filter: blur(8px);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        overflow: hidden;
        padding: 20px 30px;
        transition: all 0.3s ease;
      }
      
      .auth-glass-card:hover {
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      
      /* Form container */
      .auth-form-container {
        padding: 1.5rem;
        box-shadow: none;
        background: transparent;
        max-width: 100%;
        box-sizing: border-box;
      }
      
      /* Enhanced Input Fields */
      .form-input, 
      .form-button,
      .social-button,
      .form-group {
        box-sizing: border-box !important;
        max-width: 100% !important;
        width: 100% !important;
        overflow: hidden !important;
      }
      
      .input-with-icon {
        position: relative;
        width: 100%;
        max-width: 100%;
        margin-bottom: 25px;
      }
      
      /* Hide labels completely */
      .input-with-icon label {
        display: none;
      }
      
      /* Enhance placeholder styling since we're not using labels */
      .input-with-icon .form-input {
        padding-left: 40px;
        height: 50px;
        font-size: 1rem;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.7);
        transition: all 0.3s ease;
        border: 2px solid transparent;
      }
      
      .input-with-icon .form-input::placeholder {
        color: #777;
        opacity: 1; /* Firefox */
        transition: opacity 0.3s ease;
      }
      
      .input-with-icon .form-input:focus::placeholder {
        opacity: 0.6;
      }
      
      .input-with-icon .input-icon {
        left: 15px;
        transition: all 0.3s ease;
        color: #999;
      }
      
      /* Focus effects for input */
      .form-input:focus {
        background-color: white;
        border-color: #646cff;
        box-shadow: 0 5px 15px rgba(100, 108, 255, 0.1);
        outline: none;
        transform: translateY(-2px);
      }
      
      .input-with-icon:focus-within .input-icon {
        color: #646cff;
        transform: translateY(-50%) scale(1.2);
      }
      
      /* Password toggle button */
      .password-toggle {
        background: none;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .password-toggle:hover {
        transform: scale(1.15);
      }
      
      .password-toggle:active {
        transform: scale(0.95);
        animation: buttonPress 0.3s;
      }
      
      /* Button styling with ripple effect */
      .form-button {
        position: relative;
        padding: 12px;
        font-size: 1.1rem;
        font-weight: 600;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        overflow: hidden;
        background: linear-gradient(45deg, #646cff, #9e66ff, #646cff);
        background-size: 200% 200%;
        color: white;
        transition: all 0.3s ease;
      }
      
      .form-button:hover {
        background-size: 150% 150%;
        animation: gradientFlow 3s ease infinite;
        box-shadow: 0 6px 15px rgba(100, 108, 255, 0.3);
      }
      
      .form-button:active {
        animation: buttonPress 0.3s;
      }
      
      /* Ripple effect for buttons */
      .form-button::after,
      .social-button::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5px;
        height: 5px;
        background: rgba(255, 255, 255, 0.5);
        opacity: 0;
        border-radius: 100%;
        transform: scale(1);
        transition: all 0s;
      }
      
      .form-button:focus:not(:active)::after,
      .social-button:focus:not(:active)::after {
        animation: rippleEffect 0.5s ease-out;
      }
      
      /* Error state for inputs */
      .form-input.error {
        border-color: #ff4d4f !important;
        animation: shake 0.5s;
      }
      
      .error-message {
        color: #ff4d4f;
        margin-top: 5px;
        font-size: 0.85rem;
        animation: shake 0.5s;
      }
      
      /* Social buttons styling */
      .social-login {
        display: flex;
        gap: 1rem;
        margin-top: 1.25rem;
        justify-content: center;
      }
      
      .social-button {
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
        padding: 10px 15px;
        border: 1px solid #e1e5f2;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .social-button:hover {
        transform: translateY(-3px);
        background: white;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
      
      .social-button:active {
        transform: translateY(0);
        animation: buttonPress 0.3s;
      }
      
      /* Checkbox styling */
      .form-checkbox {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .form-checkbox input[type="checkbox"] {
        position: relative;
        width: 18px;
        height: 18px;
        margin-right: 10px;
        appearance: none;
        background-color: rgba(255, 255, 255, 0.7);
        border: 2px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .form-checkbox input[type="checkbox"]:checked {
        background-color: #646cff;
        border-color: #646cff;
      }
      
      .form-checkbox input[type="checkbox"]:checked:after {
        content: '';
        position: absolute;
        top: 2px;
        left: 6px;
        width: 4px;
        height: 8px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
      
      .form-checkbox input[type="checkbox"]:hover {
        border-color: #646cff;
        box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.1);
      }
      
      .form-checkbox label {
        cursor: pointer;
        user-select: none;
        font-size: 0.95rem;
      }
      
      /* Links styling */
      .form-link a,
      .forgot-password a,
      .form-checkbox label a {
        color: #646cff;
        text-decoration: none;
        position: relative;
        transition: all 0.2s ease;
      }
      
      .form-link a:hover,
      .forgot-password a:hover,
      .form-checkbox label a:hover {
        color: #535bf2;
      }
      
      .form-link a:after,
      .forgot-password a:after,
      .form-checkbox label a:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        bottom: -2px;
        left: 0;
        background-color: #646cff;
        transform: scaleX(0);
        transform-origin: bottom right;
        transition: transform 0.3s ease;
      }
      
      .form-link a:hover:after,
      .forgot-password a:hover:after,
      .form-checkbox label a:hover:after {
        transform: scaleX(1);
        transform-origin: bottom left;
      }
      
      /* Footer styling */
      .auth-footer {
        padding: 1rem 2rem;
        text-align: center;
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.9rem;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      }
      
      /* Footer links */
      .auth-footer-links {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        margin-top: 0.5rem;
      }
      
      .auth-footer-link {
        color: rgba(255, 255, 255, 0.9);
        text-decoration: none;
        transition: all 0.2s;
        position: relative;
      }
      
      .auth-footer-link:hover {
        color: white;
        text-shadow: 0 0 8px rgba(255,255,255,0.5);
      }
      
      .auth-footer-link:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        bottom: -2px;
        left: 0;
        background-color: white;
        transform: scaleX(0);
        transform-origin: bottom right;
        transition: transform 0.3s ease;
      }
      
      .auth-footer-link:hover:after {
        transform: scaleX(1);
        transform-origin: bottom left;
      }
      
      /* Title and subtitle styling */
      .auth-title {
        font-size: 2.2rem;
        color: #333;
        text-align: center;
        margin-bottom: 1rem;
      }
      
      .auth-subtitle {
        font-size: 1rem;
        color: #555;
        text-align: center;
        margin-bottom: 1.5rem;
      }
      
      /* Form divider */
      .form-divider {
        display: flex;
        align-items: center;
        margin: 1.5rem 0;
        color: #888;
      }
      
      .form-divider::before,
      .form-divider::after {
        content: "";
        flex: 1;
        border-bottom: 1px solid #e1e5f2;
        transition: all 0.3s ease;
      }
      
      .form-divider span {
        padding: 0 1rem;
      }
      
      .form-divider:hover::before,
      .form-divider:hover::after {
        border-color: #646cff;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Add script for handling form interactions
    const scriptElement = document.createElement('script');
    scriptElement.textContent = `
      function addRippleEffect() {
        document.addEventListener('click', function(e) {
          const buttons = document.querySelectorAll('.form-button, .social-button');
          buttons.forEach(button => {
            if (button.contains(e.target)) {
              const rect = button.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              
              const ripple = document.createElement('span');
              ripple.style.position = 'absolute';
              ripple.style.top = y + 'px';
              ripple.style.left = x + 'px';
              ripple.style.width = '1px';
              ripple.style.height = '1px';
              ripple.style.background = 'rgba(255, 255, 255, 0.7)';
              ripple.style.borderRadius = '50%';
              ripple.style.pointerEvents = 'none';
              ripple.style.transform = 'translate(-50%, -50%)';
              ripple.style.animation = 'rippleEffect 0.6s linear';
              
              button.appendChild(ripple);
              
              setTimeout(() => {
                ripple.remove();
              }, 600);
            }
          });
        });
      }
      
      // Initialize after DOM is loaded
      document.addEventListener('DOMContentLoaded', function() {
        addRippleEffect();
        
        // Now we want to restore the real placeholders instead of using labels
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
          // Get the data-placeholder if it was set, or use the original placeholder
          const placeholder = input.getAttribute('data-placeholder') || input.getAttribute('placeholder');
          if (placeholder && placeholder !== ' ') {
            input.setAttribute('placeholder', placeholder);
          }
        });
      });
    `;
    document.head.appendChild(scriptElement);
    
    return () => {
      // Cleanup
      document.body.style.overflow = originalStyles.overflow;
      document.body.style.background = originalStyles.background;
      document.body.style.backgroundSize = originalStyles.backgroundSize;
      document.head.removeChild(styleElement);
      document.head.removeChild(scriptElement);
    };
  }, [backgroundImage]);

  return (
    <>
      {/* Overlay for better text contrast */}
      <div className="auth-overlay"></div>
      
      {/* Main content wrapper */}
      <div className="auth-wrapper">        
        <main className="auth-main">
          <h1 className="auth-main-title">WAIEDU</h1>
          <div className="auth-content">
            <div className="auth-glass-card">
              {children}
            </div>
          </div>
        </main>
        
        <footer className="auth-footer">
          <p>© {new Date().getFullYear()} WAIEDU. Tất cả các quyền được bảo lưu.</p>
          <div className="auth-footer-links">
            <Link to="/terms" className="auth-footer-link">Điều khoản dịch vụ</Link>
            <Link to="/privacy" className="auth-footer-link">Chính sách bảo mật</Link>
            <Link to="/help" className="auth-footer-link">Trợ giúp</Link>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AuthLayout;
