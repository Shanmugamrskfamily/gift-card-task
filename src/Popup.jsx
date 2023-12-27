import React, { useState } from 'react';
import axios from 'axios';

const Popup = ({ isOpen }) => {
  const [giftCardNumber, setGiftCardNumber] = useState('');
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [customerNumber, setCustomerNumber] = useState('');
  const [amountToRedeem, setAmountToRedeem] = useState('');
  const [paymentApplied, setPaymentApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openPopup = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('https://gift-card-redeem-mern-shanmugamrsk.onrender.com/api/redeem-gift-card', {
        giftCardNumber: giftCardNumber,
      });
      console.log(`Response: ${response}`);
      if (response.data.isValid) {
        setBalance(response.data.balance);
        setError(null);
      } else {
        setError('Invalid gift card');
        setBalance(null);
      }
    } catch (error) {
      console.error('Error validating gift card:', error);
      setError('Invalid Gift Card Number.. Kindly Recheck!');
      setBalance(null);
    } finally {
      setIsLoading(false);
    }
  };

  const applyPayment = async () => {
    try {
      setIsLoading(true);
      if (!customerNumber || !giftCardNumber || !amountToRedeem) {
        setError('Please fill in all the required fields');
        return;
      }
      const response = await axios.put('https://gift-card-redeem-mern-shanmugamrsk.onrender.com/api/redeem-gift-card', {
        customerNumber: customerNumber,
        giftCardNumber: giftCardNumber,
        amount: amountToRedeem,
      });
      if (response.data.success) {
        setPaymentApplied(true);
        setError(null);
      } else {
        setError('Failed to apply payment');
        setPaymentApplied(false);
      }
    } catch (error) {
      console.error('Error applying payment:', error);
      setError('An error occurred while applying payment');
      setPaymentApplied(false);
    } finally {
      setIsLoading(false);
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
                  <button className="btn text-center btn-primary me-3" onClick={openPopup} disabled={isLoading}>
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
                    <div className="form-group">
                      <label htmlFor="amountToRedeem">Amount to Redeem:</label>
                      <input
                        type="number"
                        className="form-control mt-4"
                        id="amountToRedeem"
                        value={amountToRedeem}
                        onChange={(e) => setAmountToRedeem(e.target.value)}
                      />
                    </div>
                    <div className="text-center mt-3">
                      <button className="btn btn-success" onClick={applyPayment} disabled={isLoading}>
                        {isLoading ? 'Applying Payment...' : 'Apply Payment'}
                      </button>
                    </div>
                  </>
                )}
                {paymentApplied && <p className="mt-3 text-success">Payment applied successfully!</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
