import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { authService } from '../services/auth';
import '../styles/dashboard.css';
import '../styles/profile.css';

// Define the extended user type with additional fields
interface ProfileUser {
  id: string | number;
  name: string;
  email: string;
  role?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  phone?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  grade?: string | null;
  school?: string | null;
  interestedSubjects?: string[];
  teachingSubject?: string | null;
  childGrade?: string | null;
}

// Define the API response format
interface ApiUserResponse {
  message: string;
  success: 1 | 0;
  user: {
    id: number;
    name: string;
    email: string;
    role?: string;
    is_verified?: boolean;
    created_at?: string;
    updated_at?: string;
    phone?: string | null;
    birth_date?: string | null;
    gender?: string | null;
    grade?: string | null;
    school?: string | null;
    interested_subjects?: string[];
    teaching_subject?: string | null;
    child_grade?: string | null;
  };
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [formData, setFormData] = useState<ProfileUser | null>(null);

  // Subject options - same as in Register component
  const subjectOptions = [
    { id: 'physics', name: 'Vật Lý' },
    { id: 'chemistry', name: 'Hóa Học' },
    { id: 'biology', name: 'Sinh Học' },
    { id: 'math', name: 'Toán Học' },
    { id: 'literature', name: 'Văn Học' },
    { id: 'english', name: 'Tiếng Anh' },
    { id: 'history', name: 'Lịch Sử' },
    { id: 'geography', name: 'Địa Lý' }
  ];

  // Convert from API snake_case to camelCase format
  const convertApiUserToCamelCase = (apiUser: ApiUserResponse['user']): ProfileUser => {
    return {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      role: apiUser.role,
      isVerified: apiUser.is_verified,
      createdAt: apiUser.created_at,
      updatedAt: apiUser.updated_at,
      phone: apiUser.phone || null,
      birthDate: apiUser.birth_date || null,
      gender: apiUser.gender || null,
      grade: apiUser.grade || null,
      school: apiUser.school || null,
      interestedSubjects: apiUser.interested_subjects || [],
      teachingSubject: apiUser.teaching_subject || null,
      childGrade: apiUser.child_grade || null
    };
  };

  // Convert from camelCase to API snake_case format
  const convertUserToApiFormat = (user: ProfileUser): Partial<ApiUserResponse['user']> => {
    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      birth_date: user.birthDate,
      gender: user.gender,
      grade: user.grade,
      school: user.school,
      interested_subjects: user.interestedSubjects,
      teaching_subject: user.teachingSubject,
      child_grade: user.childGrade
    };
  };

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      // First get user from local storage
      const currentUser = authService.getUser();
      
      if (!currentUser) {
        navigate('/auth/login');
        return;
      }

      setUser(currentUser as ProfileUser);
      setFormData(currentUser as ProfileUser);
      
      try {
        // Get fresh user data from API
        if (currentUser.id) {
          const API_URL = import.meta.env.VITE_API_URL;
          const token = authService.getToken();
          
          const response = await fetch(`${API_URL}/users/${currentUser.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const responseData: ApiUserResponse = await response.json();
            
            if (responseData.success === 1 && responseData.user) {
              // Convert API response to our format
              const userData = convertApiUserToCamelCase(responseData.user);
              setUser(userData);
              setFormData(userData);
              // Update local storage with fresh data
              localStorage.setItem('user', JSON.stringify(userData));
            }
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        // We don't set error here as we already have the cached user data
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    if (!formData) return;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [id]: checked
      });
    } else {
      setFormData({
        ...formData,
        [id]: value
      });
    }
    
    // Clear messages
    setError(null);
    setSuccess(null);
  };

  // Handle subject checkbox changes
  const handleSubjectChange = (subjectId: string) => {
    if (!formData || !formData.interestedSubjects) return;
    
    const updatedSubjects = formData.interestedSubjects.includes(subjectId)
      ? formData.interestedSubjects.filter(id => id !== subjectId)
      : [...formData.interestedSubjects, subjectId];
    
    setFormData({
      ...formData,
      interestedSubjects: updatedSubjects
    });
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Reset form data when canceling edit
      setFormData(user);
    }
    setIsEditing(!isEditing);
    setError(null);
    setSuccess(null);
  };

  // Save profile changes
  const saveChanges = async () => {
    if (!formData || !user || !user.id) return;
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = authService.getToken();
      
      // Convert our user data format to API format (snake_case)
      const apiUserData = convertUserToApiFormat(formData);
      
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiUserData)
      });
      
      const responseData = await response.json();
      
      if (response.ok && responseData.success === 1) {
        const updatedUser = responseData.user as ProfileUser;
        setUser(updatedUser);
        setFormData(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setSuccess(responseData.message || 'Thông tin cá nhân đã được cập nhật thành công.');
        setIsEditing(false);
      } else {
        setError(responseData.message || 'Không thể cập nhật thông tin. Vui lòng thử lại sau.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại sau.');
    } finally {
      setSaving(false);
    }
  };

  // Display proper label for gender
  const getGenderLabel = (gender: string | undefined | null) => {
    switch (gender) {
      case 'male': return 'Nam';
      case 'female': return 'Nữ';
      case 'other': return 'Khác';
      default: return 'Không xác định';
    }
  };

  // Get role label
  const getRoleLabel = (role: string | undefined) => {
    switch (role) {
      case 'student': return 'Học sinh';
      case 'teacher': return 'Giáo viên';
      case 'parent': return 'Phụ huynh';
      case 'admin': return 'Quản trị viên';
      default: return 'Người dùng';
    }
  };

  // Get subject name by id
  const getSubjectName = (id: string) => {
    const subject = subjectOptions.find(s => s.id === id);
    return subject ? subject.name : id;
  };

  if (loading) {
    return (
      <DashboardLayout title="Hồ sơ cá nhân" userRole={user?.role as "student" | "teacher" | "parent" | "admin" | undefined}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Hồ sơ cá nhân" userRole={user?.role as "student" | "teacher" | "parent" | "admin" | undefined}>
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="profile-info">
            <h1>{user?.name}</h1>
            <span className="profile-role">{getRoleLabel(user?.role)}</span>
          </div>
          <div className="profile-actions">
            <button 
              className={`profile-button ${isEditing ? 'cancel' : 'edit'}`} 
              onClick={toggleEditMode}
            >
              {isEditing ? 'Hủy' : 'Chỉnh sửa'}
            </button>
            
            {isEditing && (
              <button 
                className="profile-button save" 
                onClick={saveChanges}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="none" strokeWidth="4" stroke="currentColor" strokeDasharray="32" strokeDashoffset="32">
                        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                    <span>Đang lưu...</span>
                  </>
                ) : 'Lưu thay đổi'}
              </button>
            )}
          </div>
        </div>
        
        {error && <div className="profile-message error">{error}</div>}
        {success && <div className="profile-message success">{success}</div>}
        
        <div className="profile-content">
          <div className="profile-section">
            <h2>Thông tin tài khoản</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <label>Họ và tên</label>
                {isEditing ? (
                  <input
                    id="name"
                    type="text"
                    className="form-input"
                    value={formData?.name || ''}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <div className="field-value">{user?.name}</div>
                )}
              </div>
              
              <div className="profile-field">
                <label>Email</label>
                <div className="field-value">{user?.email}</div>
              </div>
              
              <div className="profile-field">
                <label>Vai trò</label>
                <div className="field-value">{getRoleLabel(user?.role)}</div>
              </div>
              
              <div className="profile-field">
                <label>Trạng thái</label>
                <div className="field-value">
                  {user?.isVerified ? (
                    <span className="verified-badge">Đã xác thực</span>
                  ) : (
                    <span className="unverified-badge">Chưa xác thực</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="profile-section">
            <h2>Thông tin cá nhân</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <label>Số điện thoại</label>
                {isEditing ? (
                  <input
                    id="phone"
                    type="tel"
                    className="form-input"
                    value={formData?.phone || ''}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại của bạn"
                  />
                ) : (
                  <div className="field-value">{user?.phone || 'Chưa cập nhật'}</div>
                )}
              </div>
              
              <div className="profile-field">
                <label>Ngày sinh</label>
                {isEditing ? (
                  <input
                    id="birthDate"
                    type="date"
                    className="form-input"
                    value={formData?.birthDate || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">
                    {user?.birthDate ? new Date(user.birthDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                  </div>
                )}
              </div>
              
              <div className="profile-field">
                <label>Giới tính</label>
                {isEditing ? (
                  <select
                    id="gender"
                    className="form-input"
                    value={formData?.gender || ''}
                    onChange={handleChange}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                ) : (
                  <div className="field-value">
                    {getGenderLabel(user?.gender)}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Role-specific information */}
          {user?.role === 'student' && (
            <div className="profile-section">
              <h2>Thông tin học tập</h2>
              <div className="profile-grid">
                <div className="profile-field">
                  <label>Lớp</label>
                  {isEditing ? (
                    <select
                      id="grade"
                      className="form-input"
                      value={formData?.grade || ''}
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
                  ) : (
                    <div className="field-value">
                      {user?.grade ? `Lớp ${user.grade}` : 'Chưa cập nhật'}
                    </div>
                  )}
                </div>
                
                <div className="profile-field">
                  <label>Trường học</label>
                  {isEditing ? (
                    <input
                      id="school"
                      type="text"
                      className="form-input"
                      value={formData?.school || ''}
                      onChange={handleChange}
                      placeholder="Tên trường của bạn"
                    />
                  ) : (
                    <div className="field-value">{user?.school || 'Chưa cập nhật'}</div>
                  )}
                </div>
                
                <div className="profile-field full-width">
                  <label>Môn học yêu thích</label>
                  {isEditing ? (
                    <div className="subject-checkboxes">
                      {subjectOptions.map(subject => (
                        <div className="subject-checkbox" key={subject.id}>
                          <input
                            type="checkbox"
                            id={`subject-${subject.id}`}
                            checked={formData?.interestedSubjects?.includes(subject.id) || false}
                            onChange={() => handleSubjectChange(subject.id)}
                          />
                          <label htmlFor={`subject-${subject.id}`}>{subject.name}</label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="field-value">
                      {user?.interestedSubjects && user.interestedSubjects.length > 0
                        ? user.interestedSubjects.map(id => getSubjectName(id)).join(', ')
                        : 'Chưa cập nhật'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {user?.role === 'teacher' && (
            <div className="profile-section">
              <h2>Thông tin giảng dạy</h2>
              <div className="profile-grid">
                <div className="profile-field">
                  <label>Môn giảng dạy chính</label>
                  {isEditing ? (
                    <select
                      id="teachingSubject"
                      className="form-input"
                      value={formData?.teachingSubject || ''}
                      onChange={handleChange}
                    >
                      <option value="">Chọn môn giảng dạy chính</option>
                      {subjectOptions.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="field-value">
                      {user?.teachingSubject 
                        ? getSubjectName(user.teachingSubject) 
                        : 'Chưa cập nhật'}
                    </div>
                  )}
                </div>
                
                <div className="profile-field">
                  <label>Trường công tác</label>
                  {isEditing ? (
                    <input
                      id="school"
                      type="text"
                      className="form-input"
                      value={formData?.school || ''}
                      onChange={handleChange}
                      placeholder="Tên trường công tác"
                    />
                  ) : (
                    <div className="field-value">{user?.school || 'Chưa cập nhật'}</div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {user?.role === 'parent' && (
            <div className="profile-section">
              <h2>Thông tin trẻ</h2>
              <div className="profile-grid">
                <div className="profile-field">
                  <label>Lớp con đang học</label>
                  {isEditing ? (
                    <select
                      id="childGrade"
                      className="form-input"
                      value={formData?.childGrade || ''}
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
                  ) : (
                    <div className="field-value">
                      {user?.childGrade ? `Lớp ${user.childGrade}` : 'Chưa cập nhật'}
                    </div>
                  )}
                </div>
                
                <div className="profile-field">
                  <label>Trường học của con</label>
                  {isEditing ? (
                    <input
                      id="school"
                      type="text"
                      className="form-input"
                      value={formData?.school || ''}
                      onChange={handleChange}
                      placeholder="Tên trường của con bạn"
                    />
                  ) : (
                    <div className="field-value">{user?.school || 'Chưa cập nhật'}</div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="profile-section">
            <h2>Thông tin tài khoản</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <label>Ngày tạo tài khoản</label>
                <div className="field-value">
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Không có thông tin'}
                </div>
              </div>
              
              <div className="profile-field">
                <label>Cập nhật lần cuối</label>
                <div className="field-value">
                  {user?.updatedAt 
                    ? new Date(user.updatedAt).toLocaleDateString('vi-VN', {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Không có thông tin'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;