// Popup.js
import React, { useState } from 'react';
import axios from 'axios';

const Popup = ({ isOpen, onClose }) => {
  const [giftCardNumber, setGiftCardNumber] = useState('');
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [customerNumber, setCustomerNumber] = useState('');
  const [paymentApplied, setPaymentApplied] = useState(false);

  const openPopup = async () => {
    try {
      const response = await axios.get(`http://localhost:5500/validateGiftCard/${giftCardNumber}`);
      if (response.data.isValid) {
        setBalance(response.data.balance);
        setError(null);
      } else {
        setError('Invalid gift card');
        setBalance(null);
      }
    } catch (error) {
      console.error('Error validating gift card:', error);
      setError('An error occurred while validating the gift card');
      setBalance(null);
    }
  };

  const applyPayment = async () => {
    try {
      const response = await axios.post('http://localhost:5500/applyPayment', {
        customerNumber,
        cardNumber: giftCardNumber,
        balance,
      });
      setPaymentApplied(true);
      console.log(response.data.message);
    } catch (error) {
      console.error('Error applying payment:', error);
      setError('An error occurred while applying the payment');
    }
  };

  return (
    <div className={`popup ${isOpen ? 'open' : ''}`}>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Gift Card Validation</h5>
                <div className="form-group">
                  <label htmlFor="giftCardNumber">Gift Card Number:</label>
                  <input
                    type="text"
                    className="form-control mt-4"
                    id="giftCardNumber"
                    value={giftCardNumber}
                    onChange={(e) => setGiftCardNumber(e.target.value)}
                  />
                </div>
                {error && <p className="mt-3 text-danger">{error}</p>}
                {balance && <p className="mt-3">Gift card balance: {balance}</p>}
                <div className='text-center mt-3'>
                <button className="btn text-center btn-primary me-3" onClick={openPopup}>
                        Redeem
                        </button>
                        </div>
                {!paymentApplied && (
                  <>
                    <div className="form-group">
                      <label htmlFor="customerNumber">Customer Number:</label>
                      <input
                        type="text"
                        className="form-control mt-4"
                        id="customerNumber"
                        value={customerNumber}
                        onChange={(e) => setCustomerNumber(e.target.value)}
                      />
                    </div>
                    <div className="text-center mt-3">
                      <button className="btn btn-success" onClick={applyPayment}>
                        Apply Payment
                      </button>
                    </div>
                  </>
                )}
                {paymentApplied && <p className="mt-3 text-success">Payment applied successfully!</p>}
                <div className="text-center mt-3">
                  <button className="btn btn-secondary" onClick={onClose}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
