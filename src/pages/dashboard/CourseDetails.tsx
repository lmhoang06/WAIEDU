import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { authService } from '../../services/auth';

type CourseDetails = {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  instructor_avatar?: string;
  progress: number;
  image_url: string;
  last_accessed: string;
  total_modules: number;
  completed_modules: number;
  total_hours: number;
  rating: number;
  students_count: number;
  updated_at: string;
};

type Module = {
  id: string;
  title: string;
  duration: string;
  lessons_count: number;
  completed_count: number;
  lessons: Lesson[];
  expanded: boolean;
};

type Lesson = {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'reading' | 'experiment';
  duration: string;
  completed: boolean;
};

type ActivityItem = {
  id: string;
  title: string;
  type: string;
  date: string;
  duration?: string;
  score?: number;
};

type Resource = {
  id: string;
  title: string;
  type: 'document' | 'presentation' | 'spreadsheet' | 'link' | 'video';
  size?: string;
  last_updated: string;
};

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState('content');
  
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [resources, setResources] = useState<Record<string, Resource[]>>({});
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = authService.getToken();
        
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        // Fetch course details
        const response = await fetch(`http://localhost:5000/main/courses/${courseId}?$details=true`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        
        const data = await response.json();

        if (!data.success) {
          setError(data.message || 'Failed to fetch course details');
          setLoading(false);
          return;
        }

        setCourseDetails({
          id: data.course.id,
          title: data.course.title,
          description: data.course.description || 'No description available',
          category: data.course.subject_name || data.course.subject_id || 'Unknown Category',
          instructor: data.course.teacher_name || `Teacher ID: ${data.course.teacher_user_id}`,
          progress: data.course.progress || 0,
          image_url: data.course.image_url || '/course1.svg',
          last_accessed: data.course.last_accessed || 'Never',
          total_modules: data.course.total_modules || 0,
          completed_modules: data.course.completed_modules || 0,
          total_hours: data.course.total_hours || 0,
          rating: data.course.rating || 4.0,
          students_count: data.course.students_count || 0,
          updated_at: data.course.updated_at || 'Unknown',
        });

        // If API call was successful but backend isn't implemented yet, use mock data
        const useMock = true;
        if (useMock) {
          const mockModules: Module[] = [
            {
              id: '1',
              title: 'Giới thiệu về Vật lý lượng tử',
              duration: '4 giờ',
              lessons_count: 6,
              completed_count: 6,
              expanded: false,
              lessons: [
                { id: '1.1', title: 'Lịch sử vật lý lượng tử', type: 'video', duration: '45 phút', completed: true },
                { id: '1.2', title: 'Các nhà khoa học và khám phá quan trọng', type: 'reading', duration: '30 phút', completed: true },
                { id: '1.3', title: 'Kiểm tra kiến thức: Lịch sử và nhà khoa học', type: 'quiz', duration: '20 phút', completed: true },
                { id: '1.4', title: 'Nguyên lý bất định Heisenberg', type: 'video', duration: '50 phút', completed: true },
                { id: '1.5', title: 'Thí nghiệm khe Young', type: 'experiment', duration: '60 phút', completed: true },
                { id: '1.6', title: 'Kiểm tra cuối chương', type: 'quiz', duration: '35 phút', completed: true }
              ]
            },
            {
              id: '2',
              title: 'Hạt và sóng: Tính chất lưỡng tính',
              duration: '6 giờ',
              lessons_count: 8,
              completed_count: 8,
              expanded: false,
              lessons: [
                { id: '2.1', title: 'Tính chất lưỡng tính của ánh sáng', type: 'video', duration: '40 phút', completed: true },
                { id: '2.2', title: 'Thí nghiệm hiệu ứng quang điện', type: 'experiment', duration: '90 phút', completed: true },
                { id: '2.3', title: 'Các phương trình lượng tử cơ bản', type: 'reading', duration: '60 phút', completed: true },
                { id: '2.4', title: 'Bài tập áp dụng', type: 'quiz', duration: '30 phút', completed: true },
                { id: '2.5', title: 'Hiệu ứng Compton', type: 'video', duration: '45 phút', completed: true },
                { id: '2.6', title: 'Thí nghiệm hiệu ứng Compton', type: 'experiment', duration: '60 phút', completed: true },
                { id: '2.7', title: 'Ứng dụng trong công nghệ hiện đại', type: 'reading', duration: '35 phút', completed: true },
                { id: '2.8', title: 'Kiểm tra cuối chương', type: 'quiz', duration: '40 phút', completed: true }
              ]
            },
            {
              id: '3',
              title: 'Nguyên lý chồng chất lượng tử',
              duration: '5 giờ',
              lessons_count: 7,
              completed_count: 5,
              expanded: false,
              lessons: [
                { id: '3.1', title: 'Giới thiệu về nguyên lý chồng chất', type: 'video', duration: '50 phút', completed: true },
                { id: '3.2', title: 'Thí nghiệm mô phỏng mèo Schrödinger', type: 'experiment', duration: '80 phút', completed: true },
                { id: '3.3', title: 'Toán học trong nguyên lý chồng chất', type: 'reading', duration: '60 phút', completed: true },
                { id: '3.4', title: 'Bài tập ứng dụng', type: 'quiz', duration: '30 phút', completed: true },
                { id: '3.5', title: 'Ứng dụng trong máy tính lượng tử', type: 'video', duration: '45 phút', completed: true },
                { id: '3.6', title: 'Thảo luận: Giải thích hiện tượng', type: 'reading', duration: '40 phút', completed: false },
                { id: '3.7', title: 'Kiểm tra cuối chương', type: 'quiz', duration: '35 phút', completed: false }
              ]
            },
            {
              id: '4',
              title: 'Các ứng dụng của vật lý lượng tử',
              duration: '8 giờ',
              lessons_count: 9,
              completed_count: 0,
              expanded: false,
              lessons: [
                { id: '4.1', title: 'Giới thiệu tổng quan về ứng dụng', type: 'video', duration: '30 phút', completed: false },
                { id: '4.2', title: 'Máy tính lượng tử', type: 'video', duration: '60 phút', completed: false },
                { id: '4.3', title: 'Mô phỏng hoạt động của CPU lượng tử', type: 'experiment', duration: '90 phút', completed: false },
                { id: '4.4', title: 'Mật mã lượng tử', type: 'reading', duration: '45 phút', completed: false },
                { id: '4.5', title: 'Thí nghiệm truyền thông tin lượng tử', type: 'experiment', duration: '60 phút', completed: false },
                { id: '4.6', title: 'Vật liệu lượng tử', type: 'video', duration: '50 phút', completed: false },
                { id: '4.7', title: 'Y học và vật lý lượng tử', type: 'reading', duration: '40 phút', completed: false },
                { id: '4.8', title: 'Bài tập tổng hợp', type: 'quiz', duration: '60 phút', completed: false },
                { id: '4.9', title: 'Kiểm tra cuối khóa', type: 'quiz', duration: '90 phút', completed: false }
              ]
            }
          ];

          const mockActivities: ActivityItem[] = [
            { id: '1', title: 'Hoàn thành bài kiểm tra Lịch sử và nhà khoa học', type: 'quiz', date: '2025-04-23', score: 92 },
            { id: '2', title: 'Xem video Nguyên lý bất định Heisenberg', type: 'video', date: '2025-04-22', duration: '50 phút' },
            { id: '3', title: 'Hoàn thành thí nghiệm khe Young', type: 'experiment', date: '2025-04-20', duration: '58 phút' },
            { id: '4', title: 'Hoàn thành kiểm tra cuối chương 1', type: 'quiz', date: '2025-04-19', score: 88 },
            { id: '5', title: 'Xem video Tính chất lưỡng tính của ánh sáng', type: 'video', date: '2025-04-18', duration: '40 phút' }
          ];

          const mockResources: Record<string, Resource[]> = {
            'Tài liệu': [
              { id: '1', title: 'Giáo trình Vật lý lượng tử cơ bản', type: 'document', size: '2.4 MB', last_updated: '2025-01-15' },
              { id: '2', title: 'Bài tập và đáp án', type: 'document', size: '1.8 MB', last_updated: '2025-02-10' },
              { id: '3', title: 'Tóm tắt kiến thức trọng tâm', type: 'document', size: '825 KB', last_updated: '2025-03-05' }
            ],
            'Bài giảng': [
              { id: '4', title: 'Thuyết trình: Lịch sử phát triển vật lý lượng tử', type: 'presentation', size: '4.2 MB', last_updated: '2025-01-20' },
              { id: '5', title: 'Bài giảng: Nguyên lý chồng chất', type: 'presentation', size: '3.6 MB', last_updated: '2025-02-28' }
            ],
            'Dữ liệu thí nghiệm': [
              { id: '6', title: 'Kết quả thí nghiệm khe Young', type: 'spreadsheet', size: '920 KB', last_updated: '2025-03-12' },
              { id: '7', title: 'Dữ liệu hiệu ứng quang điện', type: 'spreadsheet', size: '1.2 MB', last_updated: '2025-03-18' }
            ],
            'Tài liệu tham khảo': [
              { id: '8', title: 'Khóa học trực tuyến về Vật lý lượng tử - MIT', type: 'link', last_updated: '2025-01-30' },
              { id: '9', title: 'Video: Giải thích Vật lý lượng tử cho người mới bắt đầu', type: 'video', size: '250 MB', last_updated: '2025-02-05' }
            ]
          };

          setModules(mockModules);
          setActivities(mockActivities);
          setResources(mockResources);
        } else {
          // Process actual API response
          if (data.course.modules) {
            setModules(data.course.modules.map((module: any) => ({
              ...module,
              expanded: false
            })));
          }

          if (data.course.activities) {
            setActivities(data.course.activities);
          }

          if (data.course.resources) {
            setResources(data.course.resources);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Failed to load course details. Please try again later.');
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    } else {
      setError('Course ID is missing');
      setLoading(false);
    }
  }, [courseId]);

  const toggleModule = (moduleId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, expanded: !module.expanded } 
        : module
    ));
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star half-filled">★</span>);
      } else {
        stars.push(<span key={i} className="star">★</span>);
      }
    }
    
    return stars;
  };

  const renderLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <span className="lesson-type-icon">🎬</span>;
      case 'quiz':
        return <span className="lesson-type-icon">📝</span>;
      case 'reading':
        return <span className="lesson-type-icon">📚</span>;
      case 'experiment':
        return <span className="lesson-type-icon">🧪</span>;
      default:
        return <span className="lesson-type-icon">📄</span>;
    }
  };

  const renderResourceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <span className="document">📄</span>;
      case 'presentation':
        return <span className="presentation">📊</span>;
      case 'spreadsheet':
        return <span className="spreadsheet">📈</span>;
      case 'link':
        return <span className="link">🔗</span>;
      case 'video':
        return <span className="video">🎬</span>;
      default:
        return <span className="document">📄</span>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Loading Course Details..." userRole="student">
        <div className="loading-indicator">Loading course details...</div>
      </DashboardLayout>
    );
  }

  if (error || !courseDetails) {
    return (
      <DashboardLayout title="Course Not Found" userRole="student">
        <div className="no-course-message">
          <h2>Course Not Found</h2>
          <p>{error || "We couldn't find the course you're looking for."}</p>
          <Link to="/dashboard/student/courses" className="return-button">
            Return to Courses
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={courseDetails.title} userRole="student">
      <div className="course-details">
        <Link to="/dashboard/student/courses" className="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to My Courses
        </Link>

        {/* Course Header */}
        <div className="course-header">
          <div className="course-header-content">
            <div className="course-title-section">
              <span className="course-category">{courseDetails.category}</span>
              <h1 className="course-title">{courseDetails.title}</h1>
              <div className="course-meta-info">
                <div className="instructor-info">
                  <div className="instructor-avatar">
                    {courseDetails.instructor_avatar ? (
                      <img src={courseDetails.instructor_avatar} alt={courseDetails.instructor} />
                    ) : (
                      <div className="avatar-placeholder">{getInitials(courseDetails.instructor)}</div>
                    )}
                  </div>
                  <span className="instructor-name">{courseDetails.instructor}</span>
                </div>

                <div className="course-rating">
                  <div className="rating-stars">
                    {renderRatingStars(courseDetails.rating)}
                  </div>
                  <span className="rating-value">{courseDetails.rating.toFixed(1)}</span>
                </div>

                <div className="course-students">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span>{courseDetails.students_count.toLocaleString()} students</span>
                </div>

                <div className="course-last-updated">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Last updated: {formatDate(courseDetails.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="course-image-container">
            <img src={courseDetails.image_url} alt={courseDetails.title} className="course-banner" />
          </div>
        </div>

        {/* Progress Overview */}
        <div className="course-progress-overview">
          <div className="course-progress-card">
            <h3>Your Progress</h3>
            <div className="progress-container large">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${courseDetails.progress}%` }}
                ></div>
              </div>
              <div className="progress-details">
                <span className="progress-percentage">{courseDetails.progress}% Complete</span>
                <span className="progress-modules">{courseDetails.completed_modules}/{courseDetails.total_modules} modules</span>
              </div>
            </div>

            <div className="progress-stats">
              <div className="stat-item">
                <div className="stat-label">Last accessed</div>
                <div className="stat-value">{courseDetails.last_accessed != 'Never' ? formatDate(courseDetails.last_accessed) : 'Never'}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Total time</div>
                <div className="stat-value">{courseDetails.total_hours} hours</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Status</div>
                <div className="stat-value">In Progress</div>
              </div>
            </div>

            <button className="continue-button">Continue Learning</button>
          </div>

          <div className="course-progress-card">
            <h3>Quick Stats</h3>
            <div className="quick-stats-container">
              <div className="quick-stat-card">
                <div className="quick-stat-icon study-time">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="quick-stat-content">
                  <div className="quick-stat-value">12.5 hours</div>
                  <div className="quick-stat-label">Study time</div>
                </div>
              </div>

              <div className="quick-stat-card">
                <div className="quick-stat-icon quiz-score">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                </div>
                <div className="quick-stat-content">
                  <div className="quick-stat-value">90%</div>
                  <div className="quick-stat-label">Avg. quiz score</div>
                </div>
              </div>

              <div className="quick-stat-card">
                <div className="quick-stat-icon completion">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="quick-stat-content">
                  <div className="quick-stat-value">18/30</div>
                  <div className="quick-stat-label">Lessons completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content Tabs */}
        <div className="course-content-container">
          <div className="course-tabs">
            <button 
              className={`course-tab ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Course Content
            </button>
            <button 
              className={`course-tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Learning Analytics
            </button>
            <button 
              className={`course-tab ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              Resources
            </button>
          </div>

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="course-content-tab">
              <div className="content-description">
                <h3>About this course</h3>
                <p>{courseDetails.description}</p>
              </div>

              <div className="modules-container">
                <h3>Course Modules</h3>
                {modules.map(module => (
                  <div className="module-item" key={module.id}>
                    <div className="module-header" onClick={() => toggleModule(module.id)}>
                      <div>
                        <h4 className="module-title">{module.title}</h4>
                        <div className="module-meta">
                          <span>{module.duration}</span>
                          <span>•</span>
                          <span>{module.completed_count}/{module.lessons_count} lessons completed</span>
                        </div>
                      </div>
                      <div className="module-expand-icon">
                        {module.expanded ? '▼' : '►'}
                      </div>
                    </div>
                    
                    {module.expanded && (
                      <div className="module-lessons">
                        {module.lessons.map(lesson => (
                          <div className="lesson-item" key={lesson.id}>
                            <div className={`lesson-status ${lesson.completed ? 'completed' : ''}`}>
                              {lesson.completed ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              ) : (
                                <div className="status-circle"></div>
                              )}
                            </div>
                            {renderLessonIcon(lesson.type)}
                            <div className="lesson-info">
                              <div className="lesson-title">{lesson.title}</div>
                              <div className="lesson-meta">
                                <span>{lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}</span>
                                <span>•</span>
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                            <button className="lesson-button">
                              {lesson.completed ? 'Review' : 'Start'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="course-analytics-tab">
              <div className="analytics-overview">
                <h3>Learning Analytics</h3>
                <div className="analytics-cards">
                  <div className="analytics-card">
                    <h4>Time Spent by Module</h4>
                    <div className="analytics-data">
                      <div className="analytics-metric">
                        <div className="metric-label">Total Time</div>
                        <div className="metric-value">12.5 hours</div>
                      </div>
                      <div className="analytics-metric">
                        <div className="metric-label">This Week</div>
                        <div className="metric-value">2.3 hours</div>
                      </div>
                      <div className="analytics-metric">
                        <div className="metric-label">Last Session</div>
                        <div className="metric-value">45 mins</div>
                      </div>
                    </div>
                    <div className="analytics-chart-placeholder">
                      Time distribution chart will display here
                    </div>
                  </div>
                  
                  <div className="analytics-card">
                    <h4>Quiz Performance</h4>
                    <div className="analytics-data">
                      <div className="analytics-metric">
                        <div className="metric-label">Average Score</div>
                        <div className="metric-value">90%</div>
                      </div>
                      <div className="analytics-metric">
                        <div className="metric-label">Quizzes Taken</div>
                        <div className="metric-value">4/8</div>
                      </div>
                      <div className="analytics-metric">
                        <div className="metric-label">Best Score</div>
                        <div className="metric-value">96%</div>
                      </div>
                    </div>
                    <div className="analytics-chart-placeholder">
                      Quiz scores chart will display here
                    </div>
                  </div>
                </div>

                <div className="activity-timeline">
                  <h4>Recent Activity</h4>
                  <div className="timeline-container">
                    {activities.map(activity => (
                      <div className="timeline-item" key={activity.id}>
                        <div className="timeline-icon">
                          {activity.type === 'quiz' ? '📝' : 
                           activity.type === 'video' ? '🎬' : 
                           activity.type === 'experiment' ? '🧪' : '📚'}
                        </div>
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <span className="timeline-title">{activity.title}</span>
                            <span className="timeline-date">{formatDate(activity.date)}</span>
                          </div>
                          <div className="timeline-details">
                            <span>{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</span>
                            {activity.duration && (
                              <>
                                <span>•</span>
                                <span>{activity.duration}</span>
                              </>
                            )}
                            {activity.score !== undefined && (
                              <>
                                <span>•</span>
                                <span>Score: <span className="timeline-score">{activity.score}%</span></span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="course-resources-tab">
              <h3>Course Resources</h3>
              
              {Object.entries(resources).map(([category, categoryResources]) => (
                <div className="resource-category" key={category}>
                  <h4>{category}</h4>
                  {categoryResources.map(resource => (
                    <div className="resource-item" key={resource.id}>
                      <div className="resource-icon">
                        {renderResourceIcon(resource.type)}
                      </div>
                      <div className="resource-info">
                        <div className="resource-title">{resource.title}</div>
                        <div className="resource-meta">
                          {resource.size && `${resource.size} • `}
                          Last updated: {formatDate(resource.last_updated)}
                        </div>
                      </div>
                      <button className="resource-download-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetails;