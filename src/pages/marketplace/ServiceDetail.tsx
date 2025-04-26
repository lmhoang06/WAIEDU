import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import '../../styles/dashboard.css';
import courseImg1 from '../../assets/images/course1.svg';
import courseImg2 from '../../assets/images/course2.svg';

const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [activeTab, setActiveTab] = useState('description');
  const [showMoreReviews, setShowMoreReviews] = useState(false);

  const categories = {
    'physics': 'Vật Lý',
    'chemistry': 'Hóa Học',
    'biology': 'Sinh Học',
    'math': 'Toán Học',
    'tech': 'Công Nghệ',
    'language': 'Ngôn Ngữ'
  };

  // Sample data - in a real app, this would come from an API based on serviceId
  const service = {
    id: serviceId,
    title: 'Mô Phỏng Phản Ứng Hạt Nhân',
    category: 'physics' as keyof typeof categories,
    grade: '12',
    description: 'Trải nghiệm mô phỏng các phản ứng hạt nhân khác nhau trong môi trường 3D an toàn và tương tác.',
    detailedDescription: `Khóa học này cung cấp các mô phỏng tương tác 3D về các phản ứng hạt nhân khác nhau, giúp học sinh hiểu sâu về cấu trúc hạt nhân và các quá trình phản ứng. Học sinh sẽ được:

- Tương tác với các mô hình 3D của hạt nhân nguyên tử
- Theo dõi quá trình phản ứng hạt nhân theo từng bước
- Thực hiện thí nghiệm ảo về phân rã phóng xạ
- Tìm hiểu về các ứng dụng của năng lượng hạt nhân
- Giải quyết các bài tập tương tác

Khóa học này phù hợp với chương trình Vật lý lớp 12 và được thiết kế để giúp học sinh dễ dàng nắm bắt các khái niệm phức tạp.`,
    image: courseImg1,
    price: '250.000 VND',
    instructor: 'Nguyễn Văn A',
    instructorTitle: 'Giáo viên Vật lý THPT Chuyên Lê Hồng Phong',
    instructorBio: 'Thầy Nguyễn Văn A có hơn 15 năm kinh nghiệm giảng dạy Vật lý tại các trường THPT chuyên. Thầy là tác giả của nhiều sách tham khảo và đã đào tạo nhiều học sinh đạt giải cao trong các kỳ thi quốc gia và quốc tế.',
    instructorAvatar: 'NVA',
    rating: 4.8,
    students: 256,
    duration: '10 giờ học',
    lastUpdated: '15/04/2025',
    language: 'Tiếng Việt',
    featured: true,
    curriculum: [
      {
        title: 'Giới thiệu về hạt nhân nguyên tử',
        lessons: [
          { title: 'Cấu trúc của hạt nhân nguyên tử', duration: '15 phút' },
          { title: 'Các hạt cơ bản trong hạt nhân', duration: '20 phút' },
          { title: 'Lực tương tác trong hạt nhân', duration: '25 phút' }
        ]
      },
      {
        title: 'Phản ứng hạt nhân',
        lessons: [
          { title: 'Phân rã phóng xạ', duration: '30 phút' },
          { title: 'Phản ứng phân hạch hạt nhân', duration: '40 phút' },
          { title: 'Phản ứng nhiệt hạch', duration: '35 phút' }
        ]
      },
      {
        title: 'Ứng dụng năng lượng hạt nhân',
        lessons: [
          { title: 'Nhà máy điện hạt nhân', duration: '25 phút' },
          { title: 'Ứng dụng trong y học', duration: '20 phút' },
          { title: 'Các vấn đề môi trường', duration: '30 phút' }
        ]
      }
    ],
    requirements: [
      'Kiến thức cơ bản về Vật lý lớp 10-11',
      'Máy tính có kết nối internet ổn định',
      'Hiểu biết cơ bản về cấu tạo nguyên tử'
    ],
    targetAudience: [
      'Học sinh lớp 12 đang học chương trình Vật lý',
      'Học sinh chuẩn bị thi đại học khối A, A1',
      'Giáo viên Vật lý muốn có thêm tài liệu giảng dạy',
      'Người yêu thích Vật lý và muốn tìm hiểu về hạt nhân'
    ],
    reviews: [
      {
        name: 'Trần Văn X',
        avatar: 'TVX',
        rating: 5,
        date: '10/04/2025',
        comment: 'Khóa học rất hay và dễ hiểu. Các mô phỏng 3D giúp tôi hiểu rõ hơn về cấu trúc hạt nhân và quá trình phản ứng.'
      },
      {
        name: 'Lê Thị Y',
        avatar: 'LTY',
        rating: 4,
        date: '05/04/2025',
        comment: 'Nội dung khóa học phong phú, giảng viên giải thích rõ ràng. Tôi đã hiểu sâu hơn về vật lý hạt nhân nhờ khóa học này.'
      },
      {
        name: 'Phạm Văn Z',
        avatar: 'PVZ',
        rating: 5,
        date: '28/03/2025',
        comment: 'Tài liệu rất chi tiết và các bài tập tương tác rất hữu ích. Đây là một trong những khóa học tốt nhất mà tôi từng tham gia.'
      }
    ],
    relatedServices: [
      {
        id: '2',
        title: 'Thí Nghiệm Phân Tích Hóa Học',
        category: 'chemistry' as keyof typeof categories,
        grade: '11',
        image: courseImg2,
        price: '220.000 VND',
        instructor: 'Trần Thị B',
        rating: 4.7
      },
      {
        id: '4',
        title: 'Toán Học Tương Tác',
        category: 'math' as keyof typeof categories,
        grade: '8',
        image: courseImg1,
        price: '200.000 VND',
        instructor: 'Phạm Thị D',
        rating: 4.6
      }
    ]
  };

  // Generate average rating display
  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="star half-filled">★</span>);
      } else {
        stars.push(<span key={i} className="star">★</span>);
      }
    }
    return stars;
  };

  return (
    <DashboardLayout title="Service Details" userRole="student">
      <div className="service-detail-container">
        <div className="service-detail-header">
          <div className="service-detail-breadcrumb">
            <Link to="/marketplace">Marketplace</Link> / <span>{categories[service.category]}</span> / <span>Grade {service.grade}</span>
          </div>
          
          <h1 className="service-detail-title">{service.title}</h1>
          
          <div className="service-detail-meta">
            <div className="service-rating">
              {renderRatingStars(service.rating)}
              <span className="rating-value">{service.rating}</span>
              <span className="rating-count">({service.reviews.length} reviews)</span>
            </div>
            <div className="service-students">
              <span>{service.students} students enrolled</span>
            </div>
            <div className="service-author">
              <span>Created by <Link to={`/profile/${service.instructor.replace(/\s+/g, '-').toLowerCase()}`}>{service.instructor}</Link></span>
            </div>
            <div className="service-last-updated">
              <span>Last updated: {service.lastUpdated}</span>
            </div>
          </div>
        </div>
        
        <div className="service-detail-content">
          <div className="service-detail-main">
            <div className="service-preview-image">
              <img src={service.image} alt={service.title} />
            </div>
            
            <div className="service-detail-tabs">
              <div className="tab-headers">
                <button 
                  className={`tab-header ${activeTab === 'description' ? 'active' : ''}`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button 
                  className={`tab-header ${activeTab === 'curriculum' ? 'active' : ''}`}
                  onClick={() => setActiveTab('curriculum')}
                >
                  Curriculum
                </button>
                <button 
                  className={`tab-header ${activeTab === 'instructor' ? 'active' : ''}`}
                  onClick={() => setActiveTab('instructor')}
                >
                  Instructor
                </button>
                <button 
                  className={`tab-header ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'description' && (
                  <div className="description-tab">
                    <div className="service-description">
                      <p>{service.detailedDescription}</p>
                    </div>
                    
                    <div className="service-requirements">
                      <h3>Requirements</h3>
                      <ul>
                        {service.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="service-audience">
                      <h3>Who This Service is For</h3>
                      <ul>
                        {service.targetAudience.map((audience, index) => (
                          <li key={index}>{audience}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {activeTab === 'curriculum' && (
                  <div className="curriculum-tab">
                    <h3>Course Content</h3>
                    <div className="curriculum-summary">
                      <span>{service.curriculum.reduce((acc, section) => acc + section.lessons.length, 0)} lessons</span>
                      <span>{service.duration} total length</span>
                    </div>
                    
                    <div className="course-sections">
                      {service.curriculum.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="course-section">
                          <div className="section-header">
                            <h4>{section.title}</h4>
                            <span>{section.lessons.length} lessons</span>
                          </div>
                          <div className="section-lessons">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="lesson-item">
                                <div className="lesson-icon">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                  </svg>
                                </div>
                                <div className="lesson-title">{lesson.title}</div>
                                <div className="lesson-duration">{lesson.duration}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'instructor' && (
                  <div className="instructor-tab">
                    <div className="instructor-profile">
                      <div className="instructor-avatar">
                        <div className="avatar-placeholder">{service.instructorAvatar}</div>
                      </div>
                      <div className="instructor-info">
                        <h3>{service.instructor}</h3>
                        <p className="instructor-title">{service.instructorTitle}</p>
                        <div className="instructor-stats">
                          <div className="stat">
                            <span className="stat-value">{service.rating}</span>
                            <span className="stat-label">Rating</span>
                          </div>
                          <div className="stat">
                            <span className="stat-value">{service.reviews.length}</span>
                            <span className="stat-label">Reviews</span>
                          </div>
                          <div className="stat">
                            <span className="stat-value">{service.students}</span>
                            <span className="stat-label">Students</span>
                          </div>
                          <div className="stat">
                            <span className="stat-value">8</span>
                            <span className="stat-label">Courses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="instructor-bio">
                      <p>{service.instructorBio}</p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div className="reviews-tab">
                    <div className="reviews-summary">
                      <div className="rating-summary">
                        <div className="rating-big">{service.rating}</div>
                        <div className="rating-stars">
                          {renderRatingStars(service.rating)}
                        </div>
                        <div className="rating-count">{service.reviews.length} reviews</div>
                      </div>
                    </div>
                    
                    <div className="reviews-list">
                      {(showMoreReviews ? service.reviews : service.reviews.slice(0, 2)).map((review, index) => (
                        <div key={index} className="review-item">
                          <div className="review-header">
                            <div className="reviewer-avatar">
                              <div className="avatar-placeholder">{review.avatar}</div>
                            </div>
                            <div className="reviewer-info">
                              <div className="reviewer-name">{review.name}</div>
                              <div className="review-date">{review.date}</div>
                            </div>
                            <div className="review-rating">
                              {renderRatingStars(review.rating)}
                            </div>
                          </div>
                          <div className="review-content">
                            <p>{review.comment}</p>
                          </div>
                        </div>
                      ))}
                      
                      {service.reviews.length > 2 && (
                        <button 
                          className="show-more-reviews" 
                          onClick={() => setShowMoreReviews(!showMoreReviews)}
                        >
                          {showMoreReviews ? 'Show Less Reviews' : `Show All ${service.reviews.length} Reviews`}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="related-services">
              <h3>Related Services</h3>
              <div className="services-grid">
                {service.relatedServices.map(relatedService => (
                  <div key={relatedService.id} className="related-service-card">
                    <div className="service-image">
                      <img src={relatedService.image} alt={relatedService.title} />
                    </div>
                    <div className="service-content">
                      <span className="course-category">
                        {categories[relatedService.category]} - Grade {relatedService.grade}
                      </span>
                      <h3 className="service-title">{relatedService.title}</h3>
                      <div className="service-meta">
                        <span>By {relatedService.instructor}</span>
                        <div className="service-rating">
                          <span className="star">★</span> {relatedService.rating}
                        </div>
                      </div>
                      <div className="service-footer">
                        <div className="service-price">{relatedService.price}</div>
                        <Link to={`/marketplace/service/${relatedService.id}`} className="view-button">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="service-detail-sidebar">
            <div className="service-purchase-card">
              <div className="service-price-large">{service.price}</div>
              
              <button className="purchase-button">
                Purchase Now
              </button>
              
              <button className="add-to-cart-button">
                Add to Cart
              </button>
              
              <div className="guarantee-text">
                30-Day Money-Back Guarantee
              </div>
              
              <div className="service-includes">
                <h4>This service includes:</h4>
                <ul>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                    <span>{service.duration} of on-demand video</span>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span>15 interactive exercises</span>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                    <span>10 3D model simulations</span>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8h1a4 4 0 1 1 0 8h-1"></path>
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                      <line x1="6" y1="1" x2="6" y2="4"></line>
                      <line x1="10" y1="1" x2="10" y2="4"></line>
                      <line x1="14" y1="1" x2="14" y2="4"></line>
                    </svg>
                    <span>Full lifetime access</span>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    <span>Assignment & exercises</span>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>
              
              <div className="share-course">
                <h4>Share this service</h4>
                <div className="share-buttons">
                  <button className="share-button facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1.02-1.1h3.15V.54L14.5.53c-4.3 0-5.28 3.23-5.28 5.3v1.63H6.5v4.08h2.7V20h5.3V11.54h3.6l.46-4.08z"/>
                    </svg>
                  </button>
                  <button className="share-button twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.44 4.83c-.8.37-1.66.62-2.57.73.93-.55 1.63-1.43 1.97-2.48-.87.52-1.84.9-2.86 1.1-.83-.88-2-1.43-3.3-1.43-2.5 0-4.53 2.02-4.53 4.53 0 .36.04.7.12 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.62 1.45-.62 2.28 0 1.57.8 2.96 2.02 3.78-.75-.02-1.45-.23-2.06-.57v.06c0 2.2 1.57 4.03 3.64 4.44-.38.1-.78.16-1.2.16-.3 0-.57-.03-.85-.08.57 1.8 2.24 3.12 4.22 3.16-1.55 1.2-3.5 1.92-5.63 1.92-.37 0-.73-.02-1.08-.07 2 1.28 4.38 2.02 6.94 2.02 8.3 0 12.85-6.9 12.85-12.85 0-.2 0-.4-.02-.6.9-.63 1.67-1.42 2.28-2.34z"/>
                    </svg>
                  </button>
                  <button className="share-button linkedin">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.028-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.94v5.666H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                    </svg>
                  </button>
                  <button className="share-button email">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="service-coupon-card">
              <h4>Have a coupon?</h4>
              <div className="coupon-input">
                <input type="text" placeholder="Enter coupon code" />
                <button className="apply-coupon-btn">Apply</button>
              </div>
            </div>
            
            <div className="service-access-code-card">
              <h4>Have an access code?</h4>
              <p>If you received an access code from your teacher or school, you can redeem it here.</p>
              <button className="redeem-code-btn">Redeem Access Code</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServiceDetail;