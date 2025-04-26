import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import courseImg1 from '../../assets/images/course1.svg';

const Checkout: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: 'Vietnam',
    postalCode: ''
  });
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

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

  // Order summary calculation
  const subtotal = service.price;
  const discount = couponApplied ? discountAmount : 0;
  const tax = Math.round((subtotal - discount) * 0.1); // 10% tax
  const total = subtotal - discount + tax;

  // Format currency to VND
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' VND';
  };

  // Handle input changes
  const handleBillingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle coupon application
  const handleApplyCoupon = () => {
    setIsApplyingCoupon(true);
    
    // Simulate API call to validate coupon
    setTimeout(() => {
      if (couponCode.toUpperCase() === 'WAIEDU25') {
        setCouponApplied(true);
        setDiscountAmount(Math.round(subtotal * 0.25)); // 25% discount
      } else {
        alert('Invalid coupon code. Please try again.');
      }
      setIsApplyingCoupon(false);
    }, 1000);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would process the payment here
    // For now, we'll simulate a successful payment
    
    // Navigate to the confirmation page
    navigate(`/marketplace/confirmation/${service.id}`);
  };

  return (
    <DashboardLayout title="Checkout" userRole="student">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1 className="checkout-title">Complete Your Purchase</h1>
          <p className="checkout-subtitle">You're just one step away from accessing this educational service</p>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
            <form onSubmit={handleSubmit}>
              <div className="checkout-section billing-info">
                <h2 className="section-title">Billing Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={billingInfo.firstName}
                      onChange={handleBillingInfoChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={billingInfo.lastName}
                      onChange={handleBillingInfoChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={billingInfo.email}
                      onChange={handleBillingInfoChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={billingInfo.phoneNumber}
                      onChange={handleBillingInfoChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={billingInfo.address}
                    onChange={handleBillingInfoChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={billingInfo.city}
                      onChange={handleBillingInfoChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={billingInfo.country}
                      onChange={handleBillingInfoChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={billingInfo.postalCode}
                      onChange={handleBillingInfoChange}
                    />
                  </div>
                </div>
              </div>

              <div className="checkout-section payment-method">
                <h2 className="section-title">Payment Method</h2>
                
                <div className="payment-options">
                  <div 
                    className={`payment-option ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}
                    onClick={() => setSelectedPaymentMethod('card')}
                  >
                    <div className="payment-option-radio">
                      <div className="radio-inner"></div>
                    </div>
                    <div className="payment-option-icon card-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                      </svg>
                    </div>
                    <div className="payment-option-label">Credit / Debit Card</div>
                  </div>

                  <div 
                    className={`payment-option ${selectedPaymentMethod === 'paypal' ? 'selected' : ''}`}
                    onClick={() => setSelectedPaymentMethod('paypal')}
                  >
                    <div className="payment-option-radio">
                      <div className="radio-inner"></div>
                    </div>
                    <div className="payment-option-icon paypal-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.028-2.667 4.271-6.285 4.271h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106c-.06.371.275.705.633.705h4.606c.524 0 .968-.381 1.05-.9l.052-.332.994-6.306.064-.353c.08-.519.526-.9 1.05-.9h.66c4.292 0 7.658-1.75 8.642-6.8.406-2.066.174-3.788-.966-5.004z"/>
                      </svg>
                    </div>
                    <div className="payment-option-label">PayPal</div>
                  </div>

                  <div 
                    className={`payment-option ${selectedPaymentMethod === 'momo' ? 'selected' : ''}`}
                    onClick={() => setSelectedPaymentMethod('momo')}
                  >
                    <div className="payment-option-radio">
                      <div className="radio-inner"></div>
                    </div>
                    <div className="payment-option-icon momo-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                      </svg>
                    </div>
                    <div className="payment-option-label">MoMo</div>
                  </div>
                </div>

                {selectedPaymentMethod === 'card' && (
                  <div className="card-payment-form">
                    <div className="form-group">
                      <label htmlFor="cardNumber">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardInfo.cardNumber}
                        onChange={handleCardInfoChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="cardName">Name on Card</label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        placeholder="John Doe"
                        value={cardInfo.cardName}
                        onChange={handleCardInfoChange}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="expiryDate">Expiry Date</label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={cardInfo.expiryDate}
                          onChange={handleCardInfoChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="cvv">CVV</label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          value={cardInfo.cvv}
                          onChange={handleCardInfoChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'paypal' && (
                  <div className="payment-instructions">
                    <p>You will be redirected to PayPal to complete your purchase securely.</p>
                  </div>
                )}

                {selectedPaymentMethod === 'momo' && (
                  <div className="payment-instructions">
                    <p>You will be redirected to MoMo to complete your purchase securely.</p>
                  </div>
                )}
              </div>

              <div className="checkout-actions">
                <button type="submit" className="checkout-button">
                  Complete Purchase
                </button>
                <p className="terms-agreement">
                  By completing your purchase, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
                </p>
              </div>
            </form>
          </div>

          <div className="checkout-sidebar">
            <div className="order-summary">
              <h2 className="summary-title">Order Summary</h2>
              
              <div className="order-item">
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
              </div>

              <div className="coupon-section">
                <div className="coupon-input">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                  />
                  <button 
                    className="apply-coupon-btn"
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || couponApplied || !couponCode}
                  >
                    {isApplyingCoupon ? 'Applying...' : couponApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {couponApplied && (
                  <div className="coupon-applied">
                    Coupon applied: 25% discount
                  </div>
                )}
              </div>

              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {couponApplied && (
                  <div className="price-row discount">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="price-row">
                  <span>Tax (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="secure-checkout">
                <div className="secure-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <div className="secure-text">
                  <p>Secure Checkout</p>
                  <span>Your payment information is encrypted</span>
                </div>
              </div>

              <div className="satisfaction-guarantee">
                <div className="guarantee-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div className="guarantee-text">
                  <p>30-Day Money-Back Guarantee</p>
                  <span>Not satisfied? Get a full refund within 30 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Checkout;