import React, { useEffect, useState } from 'react';
import { authService } from '../../services/auth';

type CourseAnalytics = {
    course_id: number;
    course_title: string;
    currency_code: string;
    enrollment_count: number;
    total_revenue: number;
};

type Course = {
  id: number;
  title: string;
  category: string;
  description: string;
  image_url: string;
  price: number;
  currency_code: string;
  subject_id: string;
  subject_name: string;
  teacher_name: string;
  teacher_user_id: number;
  badge?: string;
  students?: number;
  revenue?: number;
};

const API_URL = import.meta.env.VITE_API_URL;

const TeacherDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState([
    { label: 'Active Courses', value: 0 },
    { label: 'Total Students', value: 0 },
    { label: 'Course Sales', value: '0 VND' },
    { label: 'Rating', value: '4.8' }
  ]);

  useEffect(() => {
    const fetchCourseAnalytics = async (courseId: number, token: string): Promise<CourseAnalytics | null> => {
      try {
        const response = await fetch(`${API_URL}/courses/${courseId}/analytics`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          return data.analytics;
        }
      } catch (error) {
        console.error(`Error fetching analytics for course ${courseId}:`, error);
      }
      return null;
    };

    const fetchCourses = async () => {
      const token = authService.getToken();
      const userId = authService.getUser()?.id;

      if (!token || !userId) {
        console.error('No authentication token or user ID found');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/courses?$teacher=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (data.success && data.courses) {
          // Fetch analytics for each course
          const coursesWithAnalytics = await Promise.all(
            data.courses.map(async (course: Course) => {
              const analytics = await fetchCourseAnalytics(course.id, token);
              return {
                ...course,
                badge: course.price > 40000 ? 'Popular' : course.price > 0 ? 'New' : undefined,
                students: analytics?.enrollment_count || 0,
                revenue: analytics?.total_revenue || 0
              };
            })
          );

          setCourses(coursesWithAnalytics);

          // Update stats with real data
          const activeCoursesCount = coursesWithAnalytics.length;
          const totalStudents = coursesWithAnalytics.reduce((sum, course) => sum + (course.students || 0), 0);
          const totalSales = coursesWithAnalytics.reduce((sum, course) => sum + (course.revenue || 0), 0);

          setStats([
            { label: 'Active Courses', value: activeCoursesCount },
            { label: 'Total Students', value: totalStudents },
            { label: 'Course Sales', value: `${totalSales} VND` },
            { label: 'Rating', value: '4.8' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="teacher-dashboard">
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
          <h2 className="dashboard-card-title">My Courses</h2>
          <button className="course-button">Add New Course</button>
        </div>
        
        <div className="course-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-image">
                <img src={course.image_url} alt={course.title} />
                {course.badge && <div className="course-badge">{course.badge}</div>}
              </div>
              <div className="course-content">
                <span className="course-category">{course.subject_name || course.category}</span>
                <h3>{course.title}</h3>
                <div className="course-meta">
                  <span>Students: {course.students || 0}</span>
                  <span>Price: {course.price.toLocaleString()} {course.currency_code}</span>
                </div>
                <div className="course-meta">
                  <span>Revenue: {course.revenue?.toLocaleString() || '0'} VND</span>
                </div>
                <div className="course-footer">
                  <button className="course-button">Manage</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="dashboard-card-title">Student Analytics</h2>
        </div>
        <div className="analytics-chart">
          <div className="chart-placeholder">
            <p>Student engagement and performance analytics will be displayed here</p>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="dashboard-card-title">Marketplace</h2>
          <button className="course-button">Go to Marketplace</button>
        </div>
        <div className="marketplace-preview">
          <p>
            Create and sell your courses in our educational marketplace. Design interactive experiments, 
            simulations, and teaching materials. Generate unique access codes for students and track 
            their usage.
          </p>
          
          <div className="marketplace-stats">
            <div className="marketplace-stat">
              <h3>5,400+</h3>
              <p>Active Students</p>
            </div>
            <div className="marketplace-stat">
              <h3>320+</h3>
              <p>Teacher Partners</p>
            </div>
            <div className="marketplace-stat">
              <h3>$25,000+</h3>
              <p>Monthly Sales</p>
            </div>
          </div>
          
          <button className="buy-button">Start Selling</button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="dashboard-card-title">Recent Access Codes</h2>
        </div>
        <div className="access-codes-list">
          <table className="codes-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course</th>
                <th>Generated On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PHYS-4F7D-2025</td>
                <td>Mô Phỏng Phản Ứng Hạt Nhân</td>
                <td>April 12, 2025</td>
                <td><span className="status-active">Active</span></td>
                <td><button className="table-action-btn">View</button></td>
              </tr>
              <tr>
                <td>CHEM-9A3B-2025</td>
                <td>Thí Nghiệm Phân Tích Hóa Học</td>
                <td>April 10, 2025</td>
                <td><span className="status-active">Active</span></td>
                <td><button className="table-action-btn">View</button></td>
              </tr>
              <tr>
                <td>BIO-6C2E-2025</td>
                <td>Khám Phá Tế Bào Thực Vật</td>
                <td>March 28, 2025</td>
                <td><span className="status-used">Used</span></td>
                <td><button className="table-action-btn">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;