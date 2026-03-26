import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartSummary = () => {
  const navigate = useNavigate(); // hook that allows us to programmatically navigate to different routes in our application
  const { cart } = useCart(); // use the useCart hook to access the cart state from the CartContext
  const totalAmount = cart.reduce((sum, item) => sum + item.donationAmount, 0); // calculate the total amount in the cart by reducing the cart array to a single value that sums up the donationAmount of each CartItem

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '20px',
        background: '#f8f9fa',
        padding: '10px 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        fontSize: '16px',
      }}
      onClick={() => navigate('/cart')} // when the CartSummary is clicked, navigate to the cart page>
    >
      🛒 <strong>{totalAmount.toFixed(2)}</strong>
    </div>
  );
};

export default CartSummary;
