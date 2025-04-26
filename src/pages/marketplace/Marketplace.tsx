import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import '../../styles/dashboard.css';
import courseImg1 from '../../assets/images/course1.svg';
import courseImg2 from '../../assets/images/course2.svg';
import courseImg3 from '../../assets/images/course3.svg';

const Marketplace: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data - in a real app, this would come from an API
  const services = [
    {
      id: '1',
      title: 'Mô Phỏng Phản Ứng Hạt Nhân',
      category: 'physics',
      grade: '12',
      description: 'Trải nghiệm mô phỏng các phản ứng hạt nhân khác nhau trong môi trường 3D an toàn và tương tác.',
      image: courseImg1,
      price: '250.000 VND',
      instructor: 'Nguyễn Văn A',
      rating: 4.8,
      students: 256,
      featured: true
    },
    {
      id: '2',
      title: 'Thí Nghiệm Phân Tích Hóa Học',
      category: 'chemistry',
      grade: '11',
      description: 'Thực hiện các thí nghiệm hóa học phức tạp mà không cần phòng thí nghiệm thật.',
      image: courseImg2,
      price: '220.000 VND',
      instructor: 'Trần Thị B',
      rating: 4.7,
      students: 189,
      featured: true
    },
    {
      id: '3',
      title: 'Khám Phá Tế Bào Thực Vật',
      category: 'biology',
      grade: '10',
      description: 'Tương tác với mô hình 3D của tế bào thực vật để hiểu rõ hơn về cấu trúc và chức năng.',
      image: courseImg3,
      price: '180.000 VND',
      instructor: 'Lê Văn C',
      rating: 4.5,
      students: 142
    },
    {
      id: '4',
      title: 'Toán Học Tương Tác',
      category: 'math',
      grade: '8',
      description: 'Học toán qua các mô phỏng và trò chơi tương tác thú vị.',
      image: courseImg1,
      price: '200.000 VND',
      instructor: 'Phạm Thị D',
      rating: 4.6,
      students: 210
    },
    {
      id: '5',
      title: 'Lập Trình Cho Trẻ',
      category: 'tech',
      grade: '6-9',
      description: 'Dạy lập trình cơ bản thông qua các dự án thực tế thú vị.',
      image: courseImg2,
      price: '350.000 VND',
      instructor: 'Hoàng Văn E',
      rating: 4.9,
      students: 178
    },
    {
      id: '6',
      title: 'Tiếng Anh Khoa Học',
      category: 'language',
      grade: '6-12',
      description: 'Học từ vựng khoa học bằng tiếng Anh thông qua các bài học tương tác.',
      image: courseImg3,
      price: '180.000 VND',
      instructor: 'Ngô Thị F',
      rating: 4.4,
      students: 165
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'math', label: 'Mathematics' },
    { value: 'tech', label: 'Technology' },
    { value: 'language', label: 'Languages' }
  ];

  const grades = [
    { value: 'all', label: 'All Grades' },
    { value: '6', label: 'Grade 6' },
    { value: '7', label: 'Grade 7' },
    { value: '8', label: 'Grade 8' },
    { value: '9', label: 'Grade 9' },
    { value: '10', label: 'Grade 10' },
    { value: '11', label: 'Grade 11' },
    { value: '12', label: 'Grade 12' }
  ];

  // Filter services based on selected category, grade, and search query
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesGrade = selectedGrade === 'all' || service.grade.includes(selectedGrade);
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesGrade && matchesSearch;
  });

  const featuredServices = services.filter(service => service.featured);

  return (
    <DashboardLayout title="Educational Services Marketplace" userRole="student">
      <div className="marketplace-container">
        <div className="marketplace-header">
          <h1 className="marketplace-title">Explore Educational Services</h1>
          <p className="marketplace-subtitle">
            Discover interactive experiments, simulations, and teaching materials created by expert teachers
          </p>
        </div>

        {featuredServices.length > 0 && (
          <div className="featured-services">
            <h2 className="section-title">Featured Services</h2>
            <div className="services-container">
              {featuredServices.map(service => (
                <div key={service.id} className="service-card featured">
                  <div className="service-image">
                    <img src={service.image} alt={service.title} />
                    <div className="service-badge">Featured</div>
                  </div>
                  <div className="service-content">
                    <span className="course-category">
                      {categories.find(c => c.value === service.category)?.label} - Grade {service.grade}
                    </span>
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-description">{service.description}</p>
                    <div className="service-meta">
                      <span>By {service.instructor}</span>
                      <span>{service.students} students</span>
                      <div className="service-rating">
                        <span className="star">★</span> {service.rating}
                      </div>
                    </div>
                    <div className="service-footer">
                      <div className="service-price">{service.price}</div>
                      <Link to={`/marketplace/service/${service.id}`} className="buy-button">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="marketplace-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filters">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select 
              value={selectedGrade} 
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="filter-select"
            >
              {grades.map(grade => (
                <option key={grade.value} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="all-services">
          <h2 className="section-title">All Services</h2>
          {filteredServices.length === 0 ? (
            <div className="no-services">
              No services found matching your criteria. Try adjusting your filters.
            </div>
          ) : (
            <div className="services-container">
              {filteredServices.map(service => (
                <div key={service.id} className="service-card">
                  <div className="service-image">
                    <img src={service.image} alt={service.title} />
                  </div>
                  <div className="service-content">
                    <span className="course-category">
                      {categories.find(c => c.value === service.category)?.label} - Grade {service.grade}
                    </span>
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-description">{service.description}</p>
                    <div className="service-meta">
                      <span>By {service.instructor}</span>
                      <span>{service.students} students</span>
                      <div className="service-rating">
                        <span className="star">★</span> {service.rating}
                      </div>
                    </div>
                    <div className="service-footer">
                      <div className="service-price">{service.price}</div>
                      <Link to={`/marketplace/service/${service.id}`} className="buy-button">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="marketplace-info">
          <div className="info-card">
            <h3>For Teachers</h3>
            <p>Create and sell your own educational content on our marketplace. Share your expertise with students across the country.</p>
            <Link to="/marketplace/create" className="info-button">Start Selling</Link>
          </div>
          <div className="info-card">
            <h3>For Students</h3>
            <p>Access high-quality educational content created by expert teachers. If you have an access code from your teacher, activate it here.</p>
            <Link to="/dashboard" className="info-button">Enter Access Code</Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Marketplace;