import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import courseImg1 from '../../assets/images/course1.svg';

const Confirmation: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [accessCodes, setAccessCodes] = useState<string[]>([]);
  const [showAccessCodes, setShowAccessCodes] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Sample service data - in a real app, this would come from an API based on serviceId
  const service = {
    id: serviceId || '1',
    title: 'Mô Phỏng Phản Ứng Hạt Nhân',
    category: 'physics',
    grade: '12',
    image: courseImg1,
    price: 250000, // Price in VND without formatting
    formattedPrice: '250.000 VND',
    instructor: 'Nguyễn Văn A'
  };

  useEffect(() => {
    // Simulate API call to get order details
    const timer = setTimeout(() => {
      const orderNumber = 'WAIEDU-' + Math.floor(100000 + Math.random() * 900000);
      const orderDate = new Date().toLocaleDateString('vi-VN');
      const orderTime = new Date().toLocaleTimeString('vi-VN');
      
      setOrderDetails({
        orderNumber,
        orderDate,
        orderTime,
        subtotal: service.price,
        discount: 0, // No discount in this example
        tax: Math.round(service.price * 0.1),
        total: Math.round(service.price * 1.1),
        paymentMethod: 'Credit Card',
        lastFourDigits: '4242' // In a real app, this would come from the payment processor
      });

      // Generate access codes (for teacher purchases)
      const generatedCodes = [];
      for (let i = 0; i < 5; i++) {
        generatedCodes.push('WAIEDU-' + Math.random().toString(36).substring(2, 8).toUpperCase());
      }
      setAccessCodes(generatedCodes);
      
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [service.price, serviceId]);

  // Format currency to VND
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' VND';
  };

  const handleCopyAllCodes = () => {
    navigator.clipboard.writeText(accessCodes.join('\n')).then(() => {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 3000);
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Processing Order" userRole="student">
        <div className="confirmation-loading">
          <div className="loading-spinner"></div>
          <h2>Processing Your Order</h2>
          <p>Please wait while we process your purchase...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Order Confirmation" userRole="student">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 className="confirmation-title">Purchase Successful!</h1>
          <p className="confirmation-subtitle">Thank you for your purchase. Your order has been processed successfully.</p>
        </div>

        <div className="confirmation-content">
          <div className="order-details-card">
            <h2 className="card-title">Order Details</h2>
            
            <div className="order-info">
              <div className="info-row">
                <span className="info-label">Order Number:</span>
                <span className="info-value">{orderDetails.orderNumber}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Date:</span>
                <span className="info-value">{orderDetails.orderDate} at {orderDetails.orderTime}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Payment Method:</span>
                <span className="info-value">{orderDetails.paymentMethod} (ending in {orderDetails.lastFourDigits})</span>
              </div>
            </div>
            
            <div className="order-summary">
              <div className="purchased-item">
                <div className="item-image">
                  <img src={service.image} alt={service.title} />
                </div>
                <div className="item-details">
                  <h3 className="item-title">{service.title}</h3>
                  <p className="item-category">
                    {service.category === 'physics' ? 'Vật Lý' : service.category} - Grade {service.grade}
                  </p>
                  <p className="item-instructor">By {service.instructor}</p>
                </div>
                <div className="item-price">{service.formattedPrice}</div>
              </div>
            </div>
            
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <span>{formatCurrency(orderDetails.subtotal)}</span>
              </div>
              {orderDetails.discount > 0 && (
                <div className="price-row discount">
                  <span>Discount</span>
                  <span>-{formatCurrency(orderDetails.discount)}</span>
                </div>
              )}
              <div className="price-row">
                <span>Tax (10%)</span>
                <span>{formatCurrency(orderDetails.tax)}</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>{formatCurrency(orderDetails.total)}</span>
              </div>
            </div>
          </div>
          
          {accessCodes.length > 0 && (
            <div className="access-codes-card">
              <h2 className="card-title">Access Codes</h2>
              
              <p className="access-codes-info">
                As a teacher, you've received {accessCodes.length} access codes for your students. 
                You can share these codes with your students to give them free access to this educational service.
              </p>
              
              <div className="access-codes-actions">
                <button 
                  className="toggle-codes-button"
                  onClick={() => setShowAccessCodes(!showAccessCodes)}
                >
                  {showAccessCodes ? 'Hide Access Codes' : 'Show Access Codes'}
                </button>
                
                {showAccessCodes && (
                  <button 
                    className="copy-codes-button"
                    onClick={handleCopyAllCodes}
                  >
                    {codeCopied ? 'Copied!' : 'Copy All Codes'}
                  </button>
                )}
              </div>
              
              {showAccessCodes && (
                <div className="access-codes-list">
                  {accessCodes.map((code, index) => (
                    <div key={index} className="access-code-item">
                      <span className="code-number">{index + 1}.</span>
                      <span className="code-value">{code}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="next-steps-card">
            <h2 className="card-title">Next Steps</h2>
            
            <div className="next-steps-content">
              <div className="next-step">
                <div className="step-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                </div>
                <div className="step-content">
                  <h3 className="step-title">Access Your Purchase</h3>
                  <p className="step-description">
                    You can access your purchased educational service immediately from your personal dashboard.
                  </p>
                  <Link to="/dashboard" className="step-action-button">
                    Go to Dashboard
                  </Link>
                </div>
              </div>
              
              <div className="next-step">
                <div className="step-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    <path d="M9 12h6"></path>
                    <path d="M9 16h6"></path>
                  </svg>
                </div>
                <div className="step-content">
                  <h3 className="step-title">View Receipt</h3>
                  <p className="step-description">
                    A receipt has been emailed to you. You can also download your receipt from here.
                  </p>
                  <button className="step-action-button">
                    Download Receipt
                  </button>
                </div>
              </div>
              
              <div className="next-step">
                <div className="step-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div className="step-content">
                  <h3 className="step-title">Need Help?</h3>
                  <p className="step-description">
                    If you have any questions about your purchase or need assistance, our support team is here to help.
                  </p>
                  <Link to="/support" className="step-action-button">
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="confirmation-actions">
            <Link to="/marketplace" className="continue-shopping-button">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Confirmation;