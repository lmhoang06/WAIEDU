import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { authService } from '../../services/auth';

type Course = {
  id: string;
  title: string;
  category: string;
  instructor: string;
  progress: number;
  image_url: string;
  badge: string;
  lastAccessed?: string;
  description?: string;
};

const StudentCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = authService.getToken();
        
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/main/student/enrollments', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        
        const data = await response.json();

        if (!data.enrollments) {
          setError('Failed to fetch enrollments');
          setLoading(false);
          return;
        }

        const processedCourses: Course[] = await Promise.all(
          data.enrollments.map(async (enrollment: any) => {
            const courseResponse = await fetch(`http://localhost:5000/main/courses/${enrollment.course_id}?$select=title,subject_id,teacher_user_id,image_url,description`, {
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
              badge: enrollment.progress === 100 ? 'Completed' : enrollment.progress > 0 ? 'In Progress' : 'New',
              lastAccessed: enrollment.last_accessed || 'Never',
              description: courseData.course.description || 'No description available'
            };
          })
        );

        setCourses(processedCourses);
        
        // Extract unique categories for filter dropdown
        const uniqueCategories = Array.from(new Set(processedCourses.map(course => course.category)));
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Apply filters and sorting whenever relevant states change
  useEffect(() => {
    let result = [...courses];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(course => course.category === selectedCategory);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(query) || 
        course.instructor.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'progress':
        result.sort((a, b) => b.progress - a.progress);
        break;
      case 'category':
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'instructor':
        result.sort((a, b) => a.instructor.localeCompare(b.instructor));
        break;
      default:
        break;
    }
    
    setFilteredCourses(result);
  }, [courses, searchQuery, selectedCategory, sortBy]);

  return (
    <DashboardLayout title="My Courses" userRole="student">
      <div className="student-courses">
        <div className="filters-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-actions">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="title">Sort by Name</option>
              <option value="progress">Sort by Progress</option>
              <option value="category">Sort by Category</option>
              <option value="instructor">Sort by Instructor</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-indicator">Loading courses...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredCourses.length === 0 ? (
          <div className="no-courses-message">
            <h3>No courses found</h3>
            <p>Try adjusting your filters or search for different courses.</p>
          </div>
        ) : (
          <div className="courses-container">
            <div className="course-grid">
              {filteredCourses.map(course => (
                <div key={course.id} className="course-card">
                  <div className="course-image">
                    <img src={course.image_url} alt={course.title} />
                    {course.badge && <div className="course-badge">{course.badge}</div>}
                  </div>
                  <div className="course-content">
                    <span className="course-category">{course.category}</span>
                    <h3>{course.title}</h3>
                    <p className="course-description">{course.description}</p>
                    <div className="course-meta">
                      <span>Instructor: {course.instructor}</span>
                      <span>Last accessed: {course.lastAccessed}</span>
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
                      <button className="course-button">Continue</button>
                      <Link to={`/dashboard/student/course/${course.id}`} className="course-details-link">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentCourses;