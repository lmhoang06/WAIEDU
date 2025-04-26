import React from 'react';
import courseImg1 from '../../assets/images/course1.svg';
import courseImg2 from '../../assets/images/course2.svg';
import courseImg3 from '../../assets/images/course3.svg';

const ParentDashboard: React.FC = () => {
  // Sample data - in a real app, this would come from an API
  const stats = [
    { label: 'Child Accounts', value: '2' },
    { label: 'Active Courses', value: '6' },
    { label: 'Hours Learning', value: '48' },
    { label: 'Assessment Scores', value: '85%' }
  ];

  const children = [
    {
      id: '1',
      name: 'Nguyễn Minh',
      avatar: 'NM',
      age: 14,
      grade: '9',
      school: 'THCS Nguyễn Du',
      activeCourses: 3,
      recentCourses: [
        {
          id: '1',
          title: 'Mô Phỏng Phản Ứng Hạt Nhân',
          progress: 65,
          lastAccessed: '2 days ago'
        },
        {
          id: '2',
          title: 'Thí Nghiệm Phân Tích Hóa Học',
          progress: 25,
          lastAccessed: '1 day ago'
        }
      ]
    },
    {
      id: '2',
      name: 'Nguyễn Linh',
      avatar: 'NL',
      age: 12,
      grade: '7',
      school: 'THCS Nguyễn Du',
      activeCourses: 3,
      recentCourses: [
        {
          id: '3',
          title: 'Khám Phá Tế Bào Thực Vật',
          progress: 80,
          lastAccessed: 'Today'
        },
        {
          id: '4',
          title: 'Dòng Điện Trong Các Môi Trường',
          progress: 45,
          lastAccessed: '3 days ago'
        }
      ]
    }
  ];

  const recommendedCourses = [
    {
      id: '1',
      title: 'Toán Học Tương Tác',
      category: 'Toán Học - Lớp 8',
      description: 'Học toán qua các mô phỏng và trò chơi tương tác.',
      image: courseImg1,
      price: '200.000 VND'
    },
    {
      id: '2',
      title: 'Lập Trình Cho Trẻ',
      category: 'Tin Học - Lớp 6-9',
      description: 'Dạy lập trình cơ bản thông qua các dự án thực tế.',
      image: courseImg2,
      price: '350.000 VND'
    },
    {
      id: '3',
      title: 'Tiếng Anh Khoa Học',
      category: 'Tiếng Anh - Lớp 6-12',
      description: 'Học từ vựng khoa học bằng tiếng Anh.',
      image: courseImg3,
      price: '180.000 VND'
    }
  ];

  return (
    <div className="parent-dashboard">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div className="stat-text">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="dashboard-card-title">My Children</h2>
          <button className="course-button">Add Child Account</button>
        </div>
        
        <div className="children-list">
          {children.map(child => (
            <div key={child.id} className="child-card">
              <div className="child-header">
                <div className="child-avatar">{child.avatar}</div>
                <div className="child-info">
                  <h3 className="child-name">{child.name}</h3>
                  <div className="child-meta">
                    <span>{child.age} years old • Grade {child.grade}</span>
                    <span>{child.school}</span>
                  </div>
                </div>
                <button className="child-action-btn">View Details</button>
              </div>
              
              <div className="child-courses">
                <h4>Recent Activity ({child.activeCourses} courses)</h4>
                <div className="course-activity-list">
                  {child.recentCourses.map(course => (
                    <div key={course.id} className="course-activity-item">
                      <div className="activity-info">
                        <h5>{course.title}</h5>
                        <span>Last accessed: {course.lastAccessed}</span>
                      </div>
                      <div className="activity-progress">
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <span className="progress-text">{course.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="dashboard-card-title">Learning Analytics</h2>
          <div className="header-filter">
            <select className="filter-select">
              <option>Nguyễn Minh</option>
              <option>Nguyễn Linh</option>
              <option>All Children</option>
            </select>
          </div>
        </div>
        <div className="analytics-content">
          <div className="analytics-chart">
            <div className="chart-placeholder">
              <p>Weekly learning activity and progress charts will be displayed here</p>
            </div>
          </div>
          <div className="analytics-details">
            <div className="analytics-item">
              <h4>Strengths</h4>
              <ul>
                <li>Physics: 92% success rate</li>
                <li>Biology: 88% success rate</li>
              </ul>
            </div>
            <div className="analytics-item">
              <h4>Areas to Improve</h4>
              <ul>
                <li>Chemistry: 65% success rate</li>
                <li>Math: 72% success rate</li>
              </ul>
            </div>
            <div className="analytics-item">
              <h4>Recent Achievements</h4>
              <ul>
                <li>Completed "Basic Physics" course</li>
                <li>Earned "Biology Explorer" badge</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="dashboard-card-title">Recommended Courses</h2>
          <button className="course-button">View All</button>
        </div>
        <div className="recommended-courses">
          <div className="services-container">
            {recommendedCourses.map(course => (
              <div key={course.id} className="service-card">
                <div className="service-image">
                  <img src={course.image} alt={course.title} />
                </div>
                <div className="service-content">
                  <span className="course-category">{course.category}</span>
                  <h3 className="service-title">{course.title}</h3>
                  <p className="service-description">{course.description}</p>
                  <div className="service-footer">
                    <div className="service-price">{course.price}</div>
                    <button className="buy-button">Purchase</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="dashboard-card-title">Enter Course Access Code</h2>
        </div>
        <div className="access-code-form">
          <p>If you have received a course access code from your child's teacher or school, enter it here:</p>
          <div className="code-input-container">
            <input type="text" placeholder="Enter access code (e.g. PHYS-123A-2025)" className="code-input" />
            <button className="course-button">Activate</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;