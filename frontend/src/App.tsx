import { useState } from 'react';
import './App.css'
import CategoryFilter from './CategoryFilter'
import ProjectList from './ProjectList'
import WelcomeBand from './WelcomeBand'

function App() {
  // App() is the parent, so by lifting this here, we can pass the selectedCategories state & setSelectedCategories function down to  
  // both the CategoryFilter and ProjectList components as props, allowing them to share the same state and update it as needed
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); 

  return (
    <>
    <div className="container mt-4">
      <div className="row bg-primary text-white">
        <WelcomeBand/>
      </div>
      <div className="row">
        <div className="col-md-3">
          <CategoryFilter 
            selectedCategories={selectedCategories} 
            setSelectedCategories={setSelectedCategories}/>
          {/* pass the setSelectedCategories function as a prop to the CategoryFilter component, allowing it to update the selectedCategories state */}
        </div>
        <div className="col-md-9">
          <ProjectList selectedCategories={selectedCategories}/> 
          {/* pass the selectedCategories state as a prop to the ProjectList component, allowing filtering */}
        </div>
      </div>
    </div>
    </>
  )
}

export default App
