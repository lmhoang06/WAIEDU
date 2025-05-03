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

const API_URL = import.meta.env.VITE_API_URL;

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  
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
        const response = await fetch(`${API_URL}/courses/${courseId}?$details=true`, {
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
      </div>
    </DashboardLayout>
  );
};

export default CourseDetails;