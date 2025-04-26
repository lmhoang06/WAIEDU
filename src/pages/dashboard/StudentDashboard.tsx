import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import courseImg1 from '../../assets/images/course1.svg';
// import courseImg2 from '../../assets/images/course2.svg';
import { authService } from '../../services/auth';

type Course = {
  id: string;
  title: string;
  category: string;
  instructor: string;
  progress: number;
  image_url: string;
  badge: string;
};

const API_URL = import.meta.env.VITE_API_URL;

const StudentDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState([
    { label: 'Courses Enrolled', value: '0' },
    { label: 'Completed Courses', value: '0' },
    { label: 'Badges Earned', value: '8' },
    { label: 'Hours Studied', value: '24' }
  ]);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = authService.getToken();

      const response = await fetch(`${API_URL}/student/enrollments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      const processedCourses: Course[] = await Promise.all(
        data.enrollments.map(async (enrollment: any) => {
          const courseResponse = await fetch(`${API_URL}/courses/${enrollment.course_id}?$select=title,subject_id,teacher_user_id,image_url`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });
          const courseData = await courseResponse.json();

          let instructorName = courseData.course.teacher_name || `Teacher ID: ${courseData.course.teacher_user_id}`;

          return {
            id: enrollment.course_id.toString(),
            title: courseData.course.title,
            category: courseData.course.subject_id || 'Unknown Category',
            instructor: instructorName,
            progress: enrollment.progress,
            image_url: courseData.course.image_url || null,
            badge: enrollment.progress === 100 ? 'Completed' : enrollment.progress > 0 ? 'In Progress' : 'New'
          };
        })
      );

      setCourses(processedCourses);

      // Update stats dynamically
      const enrolledCount = processedCourses.length;
      const completedCount = processedCourses.filter(course => course.progress === 100).length;
      setStats(prevStats => [
        { ...prevStats[0], value: enrolledCount.toString() },
        { ...prevStats[1], value: completedCount.toString() },
        ...prevStats.slice(2)
      ]);
    };

    fetchCourses();
  }, []);

  return (
    <div className="student-dashboard">
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
          <Link to="/dashboard/student/courses" className="course-button">View All</Link>
        </div>
        
        <div className="course-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-image">
                <img src={course.image_url} alt={course.title} />
                {course.badge && <div className="course-badge">{course.badge}</div>}
              </div>
              <div className="course-content">
                <span className="course-category">{course.category}</span>
                <h3>{course.title}</h3>
                <div className="course-meta">
                  <span>Instructor: {course.instructor}</span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{course.progress}% complete</span>
                </div>
                <div className="course-footer">
                  <Link to={`/dashboard/student/course/${course.id}`} className="course-button">Continue</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Temporary Hide due to unable to finish API in time
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="dashboard-card-title">Learning Progress</h2>
        </div>
        <div className="progress-chart">
          <div className="chart-placeholder">
            <p>Weekly learning activity chart will be displayed here</p>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="dashboard-card-title">Upcoming Classes</h2>
        </div>
        <div className="upcoming-classes">
          <div className="class-item">
            <div className="class-time">
              <div className="day">Mon</div>
              <div className="date">20</div>
            </div>
            <div className="class-details">
              <h3>Phân Tích Cấu Trúc Phân Tử</h3>
              <p>Hóa Học - 15:00 - 16:30</p>
            </div>
            <button className="class-join-btn">Join</button>
          </div>
          <div className="class-item">
            <div className="class-time">
              <div className="day">Wed</div>
              <div className="date">22</div>
            </div>
            <div className="class-details">
              <h3>Vật Lý Lượng Tử Cơ Bản</h3>
              <p>Vật Lý - 14:00 - 15:30</p>
            </div>
            <button className="class-join-btn">Join</button>
          </div>
        </div>
      </div>
      */}
    </div>
  );
};

export default StudentDashboard;