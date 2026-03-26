import { useNavigate, useParams } from 'react-router-dom';
import WelcomeBand from '../components/WelcomeBand';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../types/CartItem';
import { useState } from 'react';

function DonatePage() {
  const navigate = useNavigate(); // hook that allows us to programmatically navigate to different routes in our application
  const { projectName, projectId } = useParams(); // hook that allows us to access the URL parameters; in this case, extract the projectName parameter from the URL
  const { addToCart } = useCart(); // use the useCart hook to access the addToCart function from the CartContext, which allows us to add items to the cart
  const [donationAmount, setDonationAmount] = useState<number>(0);

  const handleAddToCart = () => {
    const newItem: CartItem = {
      projectId: Number(projectId), // convert projectId from string to number
      projectName: projectName || 'No project found', // if projectName is undefined, use a default value
      donationAmount,
    };
    addToCart(newItem); // call the addToCart function with the new CartItem to add it to the cart
    navigate('/cart'); // after adding the item to the cart, navigate to the cart page
  };
  return (
    <>
      <WelcomeBand />
      <h2>Donate to {projectName}</h2>

      <div>
        <input 
          type="number" 
          placeholder="Enter donation amount" 
          value={donationAmount} 
          onChange={(x) => setDonationAmount(Number(x.target.value))} />
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>

      <button onClick={() => navigate(-1)}>Go Back</button>
      {/* -1 says go back one page in the history stack */}
    </>
  );
}

export default DonatePage;
