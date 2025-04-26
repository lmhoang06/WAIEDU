import React from 'react';

export const FormContainer: React.FC<{
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onSubmit: (e: React.FormEvent) => void;
}> = ({ children, title, subtitle, onSubmit }) => {
  return (
    <div className="auth-form-container">
      <h1 className="auth-title">{title}</h1>
      {subtitle && <p className="auth-subtitle">{subtitle}</p>}
      <form onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
};

export const FormInput: React.FC<{
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
}> = ({ 
  id, 
  type, 
  label, 
  value, 
  onChange, 
  required = true, 
  placeholder = "", 
  error 
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={error ? "form-input error" : "form-input"}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export const FormButton: React.FC<{
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ 
  text, 
  type = "submit", 
  onClick, 
  disabled = false,
  className = "" 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`form-button ${className}`}
    >
      {text}
    </button>
  );
};

export const FormLink: React.FC<{
  text: string;
  linkText: string;
  to: string;
  onClick?: () => void;
}> = ({ text, linkText, to, onClick }) => {
  return (
    <div className="form-link">
      {text}{" "}
      <a href={to} onClick={onClick}>
        {linkText}
      </a>
    </div>
  );
};

export const FormDivider: React.FC<{
  text?: string;
}> = ({ text = "or" }) => {
  return (
    <div className="form-divider">
      <span>{text}</span>
    </div>
  );
};