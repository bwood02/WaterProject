import './App.css';
import { CartProvider } from './context/CartContext';
import AdminProjectsPage from './pages/AdminProjectsPage';
import CartPage from './pages/CartPage';
import DonatePage from './pages/DonatePage';
import ProjectsPage from './pages/ProjectsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <CartProvider>
        {/* Wrap the entire application in the CartProvider component, which will allow any child component
        within the app to access the cart state and functions provided by the CartContext */}
        <Router>
          <Routes>
            <Route path="/" element={<ProjectsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/donate/:projectName/:projectId" element={<DonatePage />} />
            {/* ':' means that projectName is an optional parameter that can be accessed in the DonatePage component using the useParams hook; 
              this allows us to dynamically render the project name on the DonatePage based on which project's "Donate" button was clicked */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/adminprojects" element={<AdminProjectsPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
