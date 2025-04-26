import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import '../styles/home.css';

// Import các icon và hình ảnh
import heroImage from '../assets/images/study.svg';
import whyUsImage from '../assets/images/Whyus.svg';
import bookIcon from '../assets/images/book.svg';
import laptopIcon from '../assets/images/laptop.svg';
import communityIcon from '../assets/images/community.svg';
import cupIcon from '../assets/images/cup.svg';

// Import logo các công ty và trường đại học
import googleLogo from '../assets/images/company-logos/google.svg'; 
import microsoftLogo from '../assets/images/company-logos/microsoft.svg';
import amazonLogo from '../assets/images/company-logos/amazon.svg';
import bkuLogo from '../assets/images/company-logos/bku.svg';
import mitLogo from '../assets/images/company-logos/mit.svg';

// Subject images (placeholders - replace with actual images)
import physicsImage from '../assets/images/subjects/physics.svg';
import chemistryImage from '../assets/images/subjects/chemistry.svg';
import biologyImage from '../assets/images/subjects/biology.svg';
import mathImage from '../assets/images/subjects/math.svg';

// Import the SVG course images
import course1Image from '../assets/images/course1.svg';
import course2Image from '../assets/images/course2.svg';
import course3Image from '../assets/images/course3.svg';

// Add import for avatar image
import avatarImage from '../assets/images/avt.png';

// Optimized image component for better loading
const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  priority = false, 
  lazyLoad = true,
  width,
  height
}: { 
  src: string; 
  alt: string; 
  className?: string; 
  priority?: boolean;
  lazyLoad?: boolean;
  width?: number;
  height?: number;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Check if image is already cached
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }

    // For IntersectionObserver implementation
    if (lazyLoad && !priority && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && imgRef.current) {
              // Set src from data-src when in viewport
              if (imgRef.current.dataset.src) {
                imgRef.current.src = imgRef.current.dataset.src;
                observer.unobserve(entry.target);
              }
            }
          });
        },
        { rootMargin: '100px' }
      );
      
      if (imgRef.current) {
        observer.observe(imgRef.current);
      }
      
      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    }
  }, [lazyLoad, priority]);

  return (
    <div className={`optimized-image-wrapper ${isLoaded ? 'loaded' : 'loading'}`}>
      {!isLoaded && <div className="image-placeholder"></div>}
      <img
        ref={imgRef}
        src={priority ? src : undefined}
        data-src={!priority ? src : undefined}
        alt={alt}
        className={`${className || ''} ${isLoaded ? 'visible' : 'hidden'}`}
        loading={priority ? 'eager' : 'lazy'}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

const Home: React.FC = () => {
  // Reference cho phần Why Choose WAIEDU
  const whyUsRef = useRef<HTMLDivElement>(null);
  // Track whether images have been pre-loaded
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  // Function to scroll to Why Us section
  const scrollToWhyUs = () => {
    whyUsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Pre-load critical images
  useEffect(() => {
    const criticalImages = [heroImage, whyUsImage];
    let loadedCount = 0;
    
    criticalImages.forEach(src => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === criticalImages.length) {
          setImagesPreloaded(true);
        }
      };
      img.src = src;
    });
    
    // Set a timeout to ensure UI doesn't get stuck if images fail to load
    const timeoutId = setTimeout(() => {
      if (!imagesPreloaded) {
        setImagesPreloaded(true);
      }
    }, 3000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Effect để thêm animation khi scroll
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(element => {
        const position = element.getBoundingClientRect();
        // Hiển thị phần tử khi người dùng scroll đến
        if (position.top < window.innerHeight - 100) {
          element.classList.add('animate');
        }
      });
      
      // Animation đặc biệt cho phần Why Choose Us
      const featureCards = document.querySelectorAll('.feature-card');
      featureCards.forEach((item, index) => {
        const position = item.getBoundingClientRect();
        if (position.top < window.innerHeight - 50) {
          setTimeout(() => {
            item.classList.add('feature-animate');
          }, index * 150); // Staggered animation
        }
      });

      // Hiệu ứng parallax cho why-us-image-wrapper
      const whyUsImage = document.querySelector('.why-us-image-wrapper');
      if (whyUsImage) {
        const scrollPosition = window.scrollY;
        const offset = scrollPosition * 0.05;
        whyUsImage.setAttribute('style', `transform: translateY(${offset}px)`);
      }

      // Hiệu ứng cho floating badges
      const badges = document.querySelectorAll('.badge');
      badges.forEach(badge => {
        const scrollPosition = window.scrollY;
        const randomOffset = Math.sin(scrollPosition * 0.003) * 8;
        badge.setAttribute('style', `transform: translateY(${randomOffset}px)`);
      });
    };

    // Thêm hiệu ứng particle cho hero section
    const createParticles = () => {
      const heroSection = document.querySelector('.hero-background');
      if (!heroSection) return;
      
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Thiết lập vị trí ngẫu nhiên
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Kích thước ngẫu nhiên
        const size = Math.random() * 15 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Độ trong suốt ngẫu nhiên
        particle.style.opacity = (Math.random() * 0.5 + 0.1).toString();
        
        // Animation delay ngẫu nhiên
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = Math.random() * 10 + 10 + 's';
        
        heroSection.appendChild(particle);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger để hiển thị các phần tử trong viewport ban đầu
    handleScroll();
    createParticles();
    
    // Thêm hiệu ứng hover cho các feature cards
    const addHoverEffects = () => {
      const featureCards = document.querySelectorAll('.feature-card');
      featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          const icon = card.querySelector('.feature-icon-wrapper');
          if (icon) {
            icon.classList.add('icon-pulse');
          }
        });
        
        card.addEventListener('mouseleave', () => {
          const icon = card.querySelector('.feature-icon-wrapper');
          if (icon) {
            icon.classList.remove('icon-pulse');
          }
        });
      });
    };
    
    addHoverEffects();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Danh sách các công ty và đại học đối tác
  const trustedPartners = [
    { name: 'Google', logo: googleLogo, alt: 'Google Logo' },
    { name: 'Microsoft', logo: microsoftLogo, alt: 'Microsoft Logo' },
    { name: 'Amazon', logo: amazonLogo, alt: 'Amazon Logo' },
    { name: 'bku University', logo: bkuLogo, alt: 'bku University Logo' },
    { name: 'MIT', logo: mitLogo, alt: 'MIT Logo' },
  ];

  // Tính năng nổi bật của WAIEDU
  const features = [
    {
      icon: bookIcon,
      title: 'Thí Nghiệm Thực Tế Ảo',
      description: 'Trải nghiệm các thí nghiệm mô phỏng 3D qua kính thực tế ảo, giúp học sinh tiếp cận với những thí nghiệm phức tạp.',
      color: 'blue'
    },
    {
      icon: laptopIcon,
      title: 'Học Mọi Lúc Mọi Nơi',
      description: 'Học sinh có thể thực hiện các thí nghiệm/mô phỏng tại bất cứ nơi nào với thiết bị VR/camera điện thoại, không bị giới hạn bởi phòng thí nghiệm trường học',
      color: 'purple'
    },
    {
      icon: communityIcon,
      title: 'Cộng Đồng Học Tập',
      description: 'Tham gia cộng đồng yêu khoa học, chia sẻ kết quả thí nghiệm và học hỏi từ bạn bè, thầy cô.',
      color: 'teal'
    },
    {
      icon: cupIcon,
      title: 'Chứng Nhận Kỹ Năng',
      description: 'Nhận chứng nhận sau khi hoàn thành các khóa thí nghiệm, giúp bổ sung hồ sơ học tập.',
      color: 'orange'
    }
  ];

  // Danh sách các môn học chính
  const subjects = [
    {
      id: 'physics',
      name: 'Vật Lý',
      icon: '⚡',
      image: physicsImage,
      description: 'Khám phá các thí nghiệm vật lý từ cơ học đến hạt nhân thông qua mô phỏng VR sống động.',
      experiments: [
        'Thí nghiệm phân rã hạt nhân',
        'Mô phỏng chuyển động của các hành tinh',
        'Thí nghiệm sóng âm và ánh sáng',
        'Thí nghiệm điện và từ trường'
      ]
    },
    {
      id: 'chemistry',
      name: 'Hóa Học',
      icon: '🧪',
      image: chemistryImage,
      description: 'Thực hiện các phản ứng hóa học phức tạp và nguy hiểm trong môi trường ảo an toàn.',
      experiments: [
        'Phản ứng kim loại kiềm với nước',
        'Thí nghiệm tổng hợp hợp chất hữu cơ',
        'Mô phỏng cấu trúc phân tử 3D',
        'Thí nghiệm điện phân'
      ]
    },
    {
      id: 'biology',
      name: 'Sinh Học',
      icon: '🧬',
      image: biologyImage,
      description: 'Khám phá cơ thể người và thực hiện các thí nghiệm sinh học phức tạp trong môi trường ảo.',
      experiments: [
        'Mô phỏng phẫu thuật và giải phẫu',
        'Quan sát quá trình phân bào',
        'Thí nghiệm về hệ tuần hoàn',
        'Khám phá ADN và đột biến gen'
      ]
    },
    {
      id: 'math',
      name: 'Toán Học',
      icon: '📊',
      image: mathImage,
      description: 'Biến các khái niệm trừu tượng thành mô hình 3D tương tác được, giúp hiểu sâu các nguyên lý toán học.',
      experiments: [
        'Mô hình hình học không gian 3D',
        'Trực quan hóa các hàm số và đồ thị',
        'Mô phỏng xác suất và thống kê',
        'Khám phá các định lý toán học'
      ]
    }
  ];

  return (
    <MainLayout>
      {/* Loading overlay that displays until critical images are loaded */}
      {!imagesPreloaded && (
        <div className="critical-image-loading-overlay">
          <div className="loading-spinner"></div>
          <p>Đang tải nội dung...</p>
        </div>
      )}
      
      {/* Hero Section - Enhanced with more animations */}
      <section className={`hero ${imagesPreloaded ? 'content-loaded' : 'content-loading'}`}>
        <div className="hero-background">
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
          <div className="container hero-container">
            <div className="hero-content animate-on-scroll">
              <h1>
                <span className="gradient-text">Khám Phá</span> Thí Nghiệm Thực Tế Ảo
              </h1>
              <p>Tham gia WAIEDU ngay hôm nay và trải nghiệm các thí nghiệm mô phỏng 3D trong môn Lý, Hóa, Sinh, Toán từ lớp 6 đến lớp 12.</p>
              <div className="hero-buttons">
                <Link to="/courses" className="btn btn-primary btn-lg btn-animated">
                  <span>Khám Phá Khóa Học</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>
                <Link to="/auth/register" className="btn btn-outline-white btn-lg">
                  <span>Bắt Đầu Ngay</span>
                </Link>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-text">Thí nghiệm</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">4</div>
                  <div className="stat-text">Môn học</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">7</div>
                  <div className="stat-text">Khối lớp</div>
                </div>
              </div>
              <button onClick={scrollToWhyUs} className="scroll-down-btn">
                <span>Tìm hiểu thêm</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>
            <div className="hero-image animate-on-scroll">
              <div className="hero-image-wrapper">
                <OptimizedImage 
                  src={heroImage} 
                  alt="Học sinh đang trải nghiệm thực tế ảo" 
                  className="floating" 
                  priority={true} 
                  lazyLoad={false} 
                  width={600} 
                  height={400}
                />
                <div className="hero-glow"></div>
              </div>
              <div className="hero-floating-badge badge-top">
                <div className="badge-icon">🧪</div>
                <div className="badge-text">Thí Nghiệm Hoá Học</div>
              </div>
              <div className="hero-floating-badge badge-bottom">
                <div className="badge-icon">⚡</div>
                <div className="badge-text">Vật Lý Hạt Nhân</div>
              </div>
              <div className="hero-floating-badge badge-right">
                <div className="badge-icon">🧬</div>
                <div className="badge-text">Mô Phỏng Sinh Học</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Only render the rest of the sections when critical images are loaded */}
      <div className={`main-content ${imagesPreloaded ? 'fade-in' : 'hidden'}`}>
        {/* Trusted By Section - Redesigned with better logos */}
        <section className="trusted-by">
          <div className="container">
            <h3 className="trusted-by-title animate-on-scroll">Được tin dùng bởi các tổ chức doanh nghiệp giáo dục hàng đầu</h3>
            <div className="trusted-logos animate-on-scroll">
              {trustedPartners.map((partner, index) => (
                <div 
                  key={partner.name} 
                  className="trusted-logo" 
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <OptimizedImage 
                    src={partner.logo}
                    alt={partner.alt}
                    className="partner-logo"
                    width={150}
                    height={80}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Feature Section - With new layout and design */}
        <section className="features-section">
          <div className="features-waves">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="#f5f8ff" fillOpacity="1" d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,208C840,213,960,203,1080,181.3C1200,160,1320,128,1380,112L1440,96L1440,320L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
            </svg>
          </div>

          <div className="features-content">
            <div className="container">
              <div className="section-header text-center animate-on-scroll" ref={whyUsRef}>
                <h2>Tại Sao Chọn <span className="gradient-text">WAIEDU</span></h2>
                <p>Khám phá những lợi ích từ nền tảng thí nghiệm thực tế ảo của chúng tôi</p>
              </div>

              <div className="why-us-container">
                {features.map((feature, index) => (
                  <div 
                    key={feature.title} 
                    className={`feature-card-modern animate-on-scroll`}
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className={`feature-icon-bg feature-${feature.color}`}>
                      <OptimizedImage 
                        src={feature.icon} 
                        alt={feature.title} 
                        className="feature-icon-modern" 
                        width={48} 
                        height={48}
                      />
                    </div>
                    <div className="feature-content">
                      <h3 className="feature-title-modern">{feature.title}</h3>
                      <p className="feature-description-modern">{feature.description}</p>
                    </div>
                  </div>
                ))}
                
                <div className="why-us-image-container animate-on-scroll">
                  <OptimizedImage 
                    src={whyUsImage} 
                    alt="Học sinh đang sử dụng kính VR" 
                    className="why-us-image floating-slow" 
                    priority={true} 
                    width={600} 
                    height={450}
                  />
                  <div className="image-decorations">
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                    <div className="decoration-circle circle-3"></div>
                  </div>
                  <div className="stats-badges">
                    <div className="stats-badge badge-students floating">
                      <span className="badge-icon">👨‍🎓</span>
                      <div>
                        <h4>50,000+</h4>
                        <p>Học sinh đang sử dụng</p>
                      </div>
                    </div>
                    <div className="stats-badge badge-courses floating" style={{ animationDelay: '1s' }}>
                      <span className="badge-icon">📚</span>
                      <div>
                        <h4>500+</h4>
                        <p>Thí nghiệm mô phỏng</p>
                      </div>
                    </div>
                    <div className="stats-badge badge-satisfaction floating" style={{ animationDelay: '0.5s' }}>
                      <span className="badge-icon">⭐</span>
                      <div>
                        <h4>95%</h4>
                        <p>Độ hài lòng</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="why-us-cta animate-on-scroll">
                <Link to="/about" className="btn btn-primary btn-lg btn-animated">
                  <span>Tìm Hiểu Thêm Về Chúng Tôi</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Subjects Section - New section for the four subjects */}
        <section className="subjects-section">
          <div className="container">
            <div className="section-header animate-on-scroll">
              <h2>Khám Phá <span className="gradient-text">Các Môn Học</span></h2>
              <p>Trải nghiệm thí nghiệm thực tế ảo trong các môn học cốt lõi từ lớp 6 đến lớp 12</p>
            </div>
            
            {subjects.map((subject, index) => (
              <div key={subject.id} className={`subject-card animate-on-scroll ${index % 2 === 1 ? 'reverse' : ''}`} style={{animationDelay: `${index * 0.2}s`}}>
                <div className="subject-image">
                  <OptimizedImage 
                    src={subject.image} 
                    alt={`Thí nghiệm ${subject.name}`} 
                    width={400} 
                    height={300}
                  />
                  <div className="subject-icon">{subject.icon}</div>
                </div>
                <div className="subject-content">
                  <h3>{subject.name}</h3>
                  <p>{subject.description}</p>
                  <div className="experiment-list">
                    <h4>Thí nghiệm tiêu biểu:</h4>
                    <ul>
                      {subject.experiments.map((exp, i) => (
                        <li key={i}>{exp}</li>
                      ))}
                    </ul>
                  </div>
                  <Link to={`/subjects/${subject.id}`} className="btn btn-primary btn-animated">
                    <span>Khám phá {subject.name}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Popular Courses Section - Refined design */}
        <section className="popular-courses">
          <div className="container">
            <div className="section-header animate-on-scroll">
              <h2>Thí Nghiệm <span className="gradient-text">Nổi Bật</span></h2>
              <p>Những thí nghiệm được học sinh yêu thích nhất</p>
            </div>
            
            <div className="courses-grid">
              {/* Course cards with enhanced styling */}
              <div className="course-card animate-on-scroll">
                <div className="course-image">
                  <OptimizedImage 
                    src={course1Image} 
                    alt="Thí nghiệm phản ứng hạt nhân" 
                    width={350} 
                    height={200}
                  />
                  <div className="course-badge">Phổ biến</div>
                </div>
                <div className="course-content">
                  <span className="course-category">Vật Lý - Lớp 12</span>
                  <h3>Mô Phỏng Phản Ứng Hạt Nhân</h3>
                  <p>Khám phá các phản ứng hạt nhân như phân hạch và hợp hạch thông qua mô phỏng VR chi tiết và an toàn.</p>
                  <div className="course-meta">
                    <div className="meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <span>4.9 (1.2k đánh giá)</span>
                    </div>
                    <div className="meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      <span>45 phút</span>
                    </div>
                    <div className="meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 0 0 1-2-2V6a2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                      <span>Nâng cao</span>
                    </div>
                  </div>
                  <div className="course-footer">
                    <div className="course-instructor">
                      <div className="instructor-avatar"></div>
                      <span>TS. Nguyễn Văn A</span>
                    </div>
                    <Link to="/courses/nuclear-reactions" className="btn btn-primary btn-sm">
                      Trải nghiệm
                    </Link>
                  </div>
                </div>
              </div>

              <div className="course-card animate-on-scroll" style={{animationDelay: '0.2s'}}>
                <div className="course-image">
                  <OptimizedImage 
                    src={course2Image} 
                    alt="Phẫu thuật ảo cơ thể người" 
                    width={350} 
                    height={200}
                  />
                  <div className="course-badge">Mới</div>
                </div>
                <div className="course-content">
                  <span className="course-category">Sinh Học - Lớp 11</span>
                  <h3>Phẫu Thuật Ảo và Giải Phẫu Cơ Thể Người</h3>
                  <p>Trải nghiệm quy trình phẫu thuật và khám phá cấu trúc chi tiết của cơ thể người qua mô phỏng 3D.</p>
                  <div className="course-meta">
                    <div className="meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <span>4.8 (950 đánh giá)</span>
                    </div>
                    <div className="meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      <span>60 phút</span>
                    </div>
                    <div className="meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 0 0 1-2-2V6a2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                      <span>Trung bình</span>
                    </div>
                  </div>
                  <div className="course-footer">
                    <div className="course-instructor">
                      <div className="instructor-avatar"></div>
                      <span>TS. Trần Thị B</span>
                    </div>
                    <Link to="/courses/virtual-surgery" className="btn btn-primary btn-sm">
                      Trải nghiệm
                    </Link>
                  </div>
                </div>
              </div>

              <div className="course-card animate-on-scroll" style={{animationDelay: '0.4s'}}>
                <div className="course-image">
                  <OptimizedImage 
                    src={course3Image} 
                    alt="Thí nghiệm hóa học" 
                    width={350} 
                    height={200}
                  />
                  <div className="course-badge">Phổ biến</div>
                </div>
                <div className="course-content">
                  <span className="course-category">Hóa Học - Lớp 10</span>
                  <h3>Phản Ứng Hóa Học Nguy Hiểm</h3>
                  <p>Thực hiện các phản ứng hóa học nguy hiểm như phản ứng kim loại kiềm với nước trong môi trường ảo an toàn.</p>
                  <div className="course-meta">
                    <div className="meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <span>4.7 (800 đánh giá)</span>
                    </div>
                    <div className="meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      <span>30 phút</span>
                    </div>
                    <div className="meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 0 0 1-2-2V6a2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                      <span>Cơ bản</span>
                    </div>
                  </div>
                  <div className="course-footer">
                    <div className="course-instructor">
                      <div className="instructor-avatar"></div>
                      <span>ThS. Lê Văn C</span>
                    </div>
                    <Link to="/courses/chemical-reactions" className="btn btn-primary btn-sm">
                      Trải nghiệm
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="view-all-container animate-on-scroll">
              <Link to="/courses" className="btn btn-outline btn-lg btn-animated">
                <span>Xem Tất Cả Thí Nghiệm</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Grade Levels Section - Reorganized by education level */}
        <section className="grade-levels">
          <div className="container">
            <div className="section-header animate-on-scroll">
              <h2><span className="gradient-text">Dành Cho Mọi Cấp Học</span></h2>
              <p>Nội dung thí nghiệm được thiết kế phù hợp cho từng khối lớp từ 6 đến 12</p>
            </div>

            <div className="grade-levels-grid">
              {/* Middle School Group */}
              <div className="grade-level-group animate-on-scroll">
                <h3>Trung học cơ sở</h3>
                <div className="grade-cards-container">
                  {[6, 7, 8, 9].map((grade) => (
                    <div key={grade} className="grade-card" style={{animationDelay: `${(grade - 6) * 0.1}s`}}>
                      <div className="grade-number">{grade}</div>
                      <h3>Lớp {grade}</h3>
                      <p>Thí nghiệm phù hợp với chương trình học lớp {grade}, giúp học sinh hiểu sâu hơn về các khái niệm.</p>
                      <Link to={`/grade/${grade}`} className="btn btn-outline">Xem chương trình</Link>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* High School Group */}
              <div className="grade-level-group animate-on-scroll">
                <h3>Trung học phổ thông</h3>
                <div className="grade-cards-container">
                  {[10, 11, 12].map((grade) => (
                    <div key={grade} className="grade-card" style={{animationDelay: `${(grade - 10) * 0.1}s`}}>
                      <div className="grade-number">{grade}</div>
                      <h3>Lớp {grade}</h3>
                      <p>Thí nghiệm phù hợp với chương trình học lớp {grade}, giúp học sinh hiểu sâu hơn về các khái niệm.</p>
                      <Link to={`/grade/${grade}`} className="btn btn-outline">Xem chương trình</Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section - Use actual avatar image */}
        <section className="testimonials">
          <div className="testimonials-background">
            <div className="container">
              <div className="section-header animate-on-scroll">
                <h2>Phản Hồi Từ <span className="gradient-text">Học Sinh</span></h2>
                <p>Trải nghiệm của học sinh khi sử dụng nền tảng thí nghiệm thực tế ảo của chúng tôi</p>
              </div>
              
              <div className="testimonials-grid">
                <div className="testimonial-card animate-on-scroll">
                  <div className="quote-mark">"</div>
                  <div className="quote">WAIEDU giúp em hiểu rõ hơn về phản ứng hạt nhân, điều mà em chỉ đọc trong sách giáo khoa. Được trực tiếp thực hiện thí nghiệm trong môi trường 3D rất thú vị và dễ nhớ.</div>
                  <div className="testimonial-author">
                    <div className="author-image">
                      <OptimizedImage 
                        src={avatarImage} 
                        alt="Student avatar"
                        width={60}
                        height={60}
                      />
                    </div>
                    <div>
                      <h4>Nguyễn Minh Tuấn</h4>
                      <p>Học sinh lớp 12</p>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card animate-on-scroll" style={{animationDelay: '0.2s'}}>
                  <div className="quote-mark">"</div>
                  <div className="quote">Thí nghiệm phẫu thuật ảo giúp em quyết định theo đuổi ngành y trong tương lai. Em có thể thực hành nhiều lần mà không sợ sai, giúp em tự tin hơn rất nhiều.</div>
                  <div className="testimonial-author">
                    <div className="author-image">
                      <OptimizedImage 
                        src={avatarImage} 
                        alt="Student avatar"
                        width={60}
                        height={60}
                      />
                    </div>
                    <div>
                      <h4>Trần Thu Hà</h4>
                      <p>Học sinh lớp 11</p>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card animate-on-scroll" style={{animationDelay: '0.4s'}}>
                  <div className="quote-mark">"</div>
                  <div className="quote">Các thí nghiệm hóa học trên WAIEDU giúp em hiểu rõ các phản ứng mà trường em không có điều kiện thực hiện. Các mô phỏng 3D rất chi tiết và sinh động.</div>
                  <div className="testimonial-author">
                    <div className="author-image">
                      <OptimizedImage 
                        src={avatarImage} 
                        alt="Student avatar"
                        width={60}
                        height={60}
                      />
                    </div>
                    <div>
                      <h4>Lê Hoàng Nam</h4>
                      <p>Học sinh lớp 9</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Counter Section */}
        <section className="stats-counter">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-counter animate-on-scroll">
                <div className="counter">500+</div>
                <div className="counter-label">Thí Nghiệm Mô Phỏng</div>
              </div>
              <div className="stat-counter animate-on-scroll" style={{animationDelay: '0.2s'}}>
                <div className="counter">50,000+</div>
                <div className="counter-label">Học Sinh Sử Dụng</div>
              </div>
              <div className="stat-counter animate-on-scroll" style={{animationDelay: '0.4s'}}>
                <div className="counter">100+</div>
                <div className="counter-label">Giáo Viên Hỗ Trợ</div>
              </div>
              <div className="stat-counter animate-on-scroll" style={{animationDelay: '0.6s'}}>
                <div className="counter">95%</div>
                <div className="counter-label">Tỷ Lệ Hài Lòng</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section - More attractive design */}
        <section className="cta">
          <div className="cta-background">
            <div className="cta-shapes">
              <div className="cta-shape cta-shape-1"></div>
              <div className="cta-shape cta-shape-2"></div>
            </div>
            <div className="container">
              <div className="cta-content animate-on-scroll">
                <h2>Sẵn Sàng Khám Phá <span className="text-white">Thế Giới Thí Nghiệm?</span></h2>
                <p>Tham gia cùng hàng nghìn học sinh đang học tập trên WAIEDU và trải nghiệm các thí nghiệm thực tế ảo độc đáo.</p>
                <div className="cta-buttons">
                  <Link to="/auth/register" className="btn btn-white btn-lg btn-animated">
                    <span>Đăng Ký Ngay</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </Link>
                  <Link to="/courses" className="btn btn-outline-white btn-lg">Xem Thí Nghiệm</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;