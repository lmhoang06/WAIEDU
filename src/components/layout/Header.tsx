import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/layout.css';
import logo from '../../assets/images/logo.svg';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="brand">
          <Link to="/" className="brand-link">
            <img src={logo} alt="WAIEDU Logo" className="brand-logo" />
            <span className="brand-name">WAIEDU</span>
          </Link>
        </div>
        
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/courses">Thí nghiệm</Link></li>
            <li><Link to="/subjects">Các môn học</Link></li>
            <li><Link to="/grade">Các lớp</Link></li>
            <li><Link to="/about">Giới thiệu</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
          </ul>
        </nav>
        
        <div className="auth-buttons">
          <Link to="/auth/login" className="btn btn-login">
            <span>Đăng nhập</span>
          </Link>
          <Link to="/auth/register" className="btn btn-primary">Đăng ký</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;