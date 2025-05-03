import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { authService } from '../../services/auth';
import registerImage from '../../assets/images/register-illustration.svg';
import { subjectOptions } from '../../types/subject';
import '../../styles/auth.css';

// Define step types
type Step = 'account' | 'personal' | 'preferences';

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  // Expanded form data to collect more comprehensive information
  const [formData, setFormData] = useState({
    // Account details
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Personal information
    phone: '',
    birthDate: '',
    gender: '',
    
    // Educational preferences
    role: 'student', // student, teacher, or parent
    grade: '',
    school: '',
    interestedSubjects: [] as string[],
    teachingSubject: '',
    childGrade: '',
    
    // Terms
    agreeTerms: false,
    agreeDataPolicy: false
  });

  // UI state
  const [currentStep, setCurrentStep] = useState<Step>('account');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [id]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
    
    // Clear specific field error when user types
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
    
    // Clear general error
    if (error) setError(null);
  };

  // Handle subject checkbox changes
  const handleSubjectChange = (subjectId: string) => {
    setFormData(prev => {
      const updatedSubjects = prev.interestedSubjects.includes(subjectId)
        ? prev.interestedSubjects.filter(id => id !== subjectId)
        : [...prev.interestedSubjects, subjectId];
      
      return {
        ...prev,
        interestedSubjects: updatedSubjects
      };
    });
  };

  // Form validation by step
  const validateCurrentStep = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (currentStep === 'account') {
      if (!formData.name.trim()) {
        newErrors.name = 'Vui lòng nhập họ tên đầy đủ';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Vui lòng nhập email';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email không hợp lệ';
      }
      
      if (!formData.password) {
        newErrors.password = 'Vui lòng nhập mật khẩu';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      }
    }
    
    else if (currentStep === 'personal') {
      if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
    }
    
    else if (currentStep === 'preferences') {
      if (!formData.role) {
        newErrors.role = 'Vui lòng chọn vai trò của bạn';
      }
      
      if (formData.role === 'student' && !formData.grade) {
        newErrors.grade = 'Vui lòng chọn lớp của bạn';
      }
      
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản dịch vụ để tiếp tục';
      }
      
      if (!formData.agreeDataPolicy) {
        newErrors.agreeDataPolicy = 'Bạn phải đồng ý với chính sách bảo mật để tiếp tục';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep === 'account') {
        setCurrentStep('personal');
      } else if (currentStep === 'personal') {
        setCurrentStep('preferences');
      }
    }
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (currentStep === 'personal') {
      setCurrentStep('account');
    } else if (currentStep === 'preferences') {
      setCurrentStep('personal');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Final form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      // Register the user with all form data
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone,
        birthDate: formData.birthDate,
        gender: formData.gender,
        role: formData.role,
        grade: formData.grade,
        school: formData.school,
        interestedSubjects: formData.interestedSubjects,
        teachingSubject: formData.teachingSubject,
        childGrade: formData.childGrade
      });
      
      // Check if registration was successful
      if (response && response.success) {
        // Show success message if needed
        console.log("Registration successful:", response.message);
        
        // Redirect to appropriate dashboard based on user role
        navigate(`/dashboard/${formData.role}`);
      } else {
        throw new Error(response.message || 'Đăng ký không thành công.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Đăng ký không thành công. Vui lòng thử lại sau.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Progress indicators based on current step
  const getStepStatus = (step: Step) => {
    if (step === currentStep) return 'active';
    
    if (
      (step === 'account' && (currentStep === 'personal' || currentStep === 'preferences')) ||
      (step === 'personal' && currentStep === 'preferences')
    ) {
      return 'completed';
    }
    
    return '';
  };

  // Render progress steps
  const renderSteps = () => {
    return (
      <div className="form-steps">
        <div className="form-step">
          <div className={`step-number ${getStepStatus('account')}`}>
            {getStepStatus('account') === 'completed' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : "1"}
          </div>
          <div className={`step-label ${getStepStatus('account')}`}>Tài khoản</div>
        </div>
        
        <div className={`step-connector ${getStepStatus('account') === 'completed' ? 'filled' : ''}`}></div>
        
        <div className="form-step">
          <div className={`step-number ${getStepStatus('personal')}`}>
            {getStepStatus('personal') === 'completed' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : "2"}
          </div>
          <div className={`step-label ${getStepStatus('personal')}`}>Thông tin</div>
        </div>
        
        <div className={`step-connector ${getStepStatus('personal') === 'completed' ? 'filled' : ''}`}></div>
        
        <div className="form-step">
          <div className={`step-number ${getStepStatus('preferences')}`}>3</div>
          <div className={`step-label ${getStepStatus('preferences')}`}>Hoàn tất</div>
        </div>
      </div>
    );
  };

  // Render account details form (Step 1)
  const renderAccountForm = () => {
    return (
      <div className="form-slide-enter">
        <div className="form-group">
          <label htmlFor="name">Họ và tên</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <input
              id="name"
              type="text"
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ tên đầy đủ của bạn"
              required
            />
          </div>
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </span>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              required
            />
          </div>
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`form-input ${errors.password ? 'error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Tạo mật khẩu (ít nhất 8 ký tự)"
              required
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2l4-4"></path>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu của bạn"
              required
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={toggleConfirmPasswordVisibility}
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>
        
        <div className="form-nav">
          <div></div> {/* Empty div for alignment */}
          <button type="button" className="form-button" onClick={goToNextStep}>
            Tiếp tục
          </button>
        </div>
      </div>
    );
  };
  
  // Render personal details form (Step 2)
  const renderPersonalForm = () => {
    return (
      <div className="form-slide-enter">
        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </span>
            <input
              id="phone"
              type="tel"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại (không bắt buộc)"
            />
          </div>
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="birthDate">Ngày sinh</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </span>
            <input
              id="birthDate"
              type="date"
              className="form-input"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="gender">Giới tính</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </span>
            <select
              id="gender"
              className="form-input"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>
        
        <div className="form-nav">
          <button type="button" className="form-button" onClick={goToPreviousStep} style={{ backgroundColor: '#f5f5f5', color: '#333' }}>
            Quay lại
          </button>
          <button type="button" className="form-button" onClick={goToNextStep}>
            Tiếp tục
          </button>
        </div>
      </div>
    );
  };
  
  // Render preferences form (Step 3)
  const renderPreferencesForm = () => {
    return (
      <div className="form-slide-enter">
        <div className="form-group">
          <label htmlFor="role">Bạn là</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </span>
            <select
              id="role"
              className={`form-input ${errors.role ? 'error' : ''}`}
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Chọn vai trò</option>
              <option value="student">Học sinh</option>
              <option value="teacher">Giáo viên</option>
              <option value="parent">Phụ huynh</option>
            </select>
          </div>
          {errors.role && <span className="error-message">{errors.role}</span>}
        </div>
        
        {/* Student-specific fields */}
        {formData.role === 'student' && (
          <>
            <div className="form-group">
              <label htmlFor="grade">Lớp</label>
              <div className="input-with-icon">
                <span className="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </span>
                <select
                  id="grade"
                  className={`form-input ${errors.grade ? 'error' : ''}`}
                  value={formData.grade}
                  onChange={handleChange}
                >
                  <option value="">Chọn lớp của bạn</option>
                  <option value="6">Lớp 6</option>
                  <option value="7">Lớp 7</option>
                  <option value="8">Lớp 8</option>
                  <option value="9">Lớp 9</option>
                  <option value="10">Lớp 10</option>
                  <option value="11">Lớp 11</option>
                  <option value="12">Lớp 12</option>
                </select>
              </div>
              {errors.grade && <span className="error-message">{errors.grade}</span>}
            </div>
          </>
        )}
        
        {/* Teacher-specific fields */}
        {formData.role === 'teacher' && (
          <div className="form-group">
            <label htmlFor="subject">Môn giảng dạy</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </span>
              <select
                id="teachingSubject"
                className="form-input"
                value={formData.teachingSubject || ''}
                onChange={handleChange}
              >
                <option value="">Chọn môn giảng dạy chính</option>
                {subjectOptions.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        {/* Parent-specific fields */}
        {formData.role === 'parent' && (
          <div className="form-group">
            <label htmlFor="childGrade">Lớp con bạn đang học</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 17.58A5 5 0 0 1 18 8h-1.26A8 8 0 1 0 4 16.25"></path>
                  <line x1="8" y1="16" x2="8.01" y2="16"></line>
                  <line x1="8" y1="20" x2="8.01" y2="20"></line>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  <line x1="12" y1="22" x2="12.01" y2="22"></line>
                  <line x1="16" y1="16" x2="16.01" y2="16"></line>
                  <line x1="16" y1="20" x2="16.01" y2="20"></line>
                </svg>
              </span>
              <select
                id="childGrade"
                className="form-input"
                value={formData.childGrade || ''}
                onChange={handleChange}
              >
                <option value="">Chọn lớp</option>
                <option value="6">Lớp 6</option>
                <option value="7">Lớp 7</option>
                <option value="8">Lớp 8</option>
                <option value="9">Lớp 9</option>
                <option value="10">Lớp 10</option>
                <option value="11">Lớp 11</option>
                <option value="12">Lớp 12</option>
              </select>
            </div>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="school">Trường học</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 22v-4l4-2 4 2 4-2 4 2v4"></path>
                <path d="M2 16v-3a7 7 0 0 1 14 0v3"></path>
                <path d="M19.5 9A9 9 0 0 0 3 9"></path>
                <circle cx="9" cy="4" r="2"></circle>
              </svg>
            </span>
            <input
              id="school"
              type="text"
              className="form-input"
              value={formData.school}
              onChange={handleChange}
              placeholder="Tên trường của bạn (không bắt buộc)"
            />
          </div>
        </div>
        
        {/* Enhanced subject checkboxes */}
        {formData.role !== 'teacher' && (
          <div className="form-group">
            <label>Môn học yêu thích</label>
            <div className="subject-checkboxes">
              {subjectOptions.map(subject => (
                <div className="subject-checkbox" key={subject.id}>
                  <input
                    type="checkbox"
                    id={`subject-${subject.id}`}
                    checked={formData.interestedSubjects.includes(subject.id)}
                    onChange={() => handleSubjectChange(subject.id)}
                  />
                  <label htmlFor={`subject-${subject.id}`}>{subject.name}</label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Unified agreement checkbox */}
        <div className="agreement-checkbox">
          <div className="form-checkbox">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={formData.agreeTerms && formData.agreeDataPolicy}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setFormData(prev => ({
                  ...prev,
                  agreeTerms: isChecked,
                  agreeDataPolicy: isChecked
                }));
                
                // Clear errors if checked
                if (isChecked) {
                  setErrors(prev => ({
                    ...prev,
                    agreeTerms: '',
                    agreeDataPolicy: ''
                  }));
                }
              }}
              required
            />
            <label htmlFor="agreeTerms">
              Tôi đồng ý với <Link to="/terms" target="_blank">Điều khoản dịch vụ</Link> và <Link to="/privacy" target="_blank">Chính sách bảo mật</Link> của WAIEDU
            </label>
          </div>
        </div>
        {(errors.agreeTerms || errors.agreeDataPolicy) && (
          <span className="error-message">Bạn phải đồng ý với điều khoản và chính sách bảo mật để tiếp tục</span>
        )}
        
        <div className="form-nav">
          <button type="button" className="form-button" onClick={goToPreviousStep} style={{ backgroundColor: '#f5f5f5', color: '#333' }}>
            Quay lại
          </button>
          <button 
            type="submit"
            className="form-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="none" strokeWidth="4" stroke="currentColor" strokeDasharray="32" strokeDashoffset="32">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
                  </circle>
                </svg>
                <span style={{ marginLeft: '8px' }}>Đang đăng ký...</span>
              </>
            ) : "Hoàn tất đăng ký"}
          </button>
        </div>
      </div>
    );
  };

  // Render proper form based on current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'account':
        return renderAccountForm();
      case 'personal':
        return renderPersonalForm();
      case 'preferences':
        return renderPreferencesForm();
      default:
        return renderAccountForm();
    }
  };

  return (
    <AuthLayout backgroundImage={registerImage}>
      <div className="auth-form-container">
        <h1 className="auth-title">Tạo tài khoản WAIEDU</h1>
        <p className="auth-subtitle">Tham gia cùng hàng nghìn học sinh và giáo viên!</p>

        {renderSteps()}
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {renderCurrentStep()}
        </form>
        
        {currentStep === 'account' && (
          <>
            {/* Social login buttons temporarily hidden
            <div className="form-divider">
              <span>hoặc đăng ký với</span>
            </div>
            
            <div className="social-login">
              <button type="button" className="social-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#4285F4">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                </svg>
                Google
              </button>
              <button type="button" className="social-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-5.8-4.698-10.5-10.498-10.5s-10.5 4.7-10.5 10.5c0 5.243 3.84 9.583 8.86 10.37v-7.337h-2.668v-3.033h2.668V9.74c0-2.633 1.568-4.085 3.966-4.085 1.15 0 2.35.205 2.35.205v2.584h-1.322c-1.304 0-1.712.81-1.712 1.64v1.97h2.912l-.465 3.032H16.14v7.337c5.02-.787 8.86-5.127 8.86-10.37"/>
                </svg>
                Facebook
              </button>
            </div>
            */}
            
            <div className="form-link">
              Đã có tài khoản? <Link to="/auth/login">Đăng nhập</Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default Register;