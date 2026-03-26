import { useState } from "react";
import CategoryFilter from "../components/CategoryFilter";
import ProjectList from "../components/ProjectList";
import WelcomeBand from "../components/WelcomeBand";
import CartSummary from "../components/CartSummary";

function ProjectsPage () {
    // ProjectsPage() is the parent, so by lifting this here, we can pass the selectedCategories state & setSelectedCategories function down to  
    // both the CategoryFilter and ProjectList components as props, allowing them to share the same state and update it as needed
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]); 

    return (
    <div className="container mt-4">
        <CartSummary /> {/* include the CartSummary component at the top of the page so that the cart contents are visible on all pages */}
        <WelcomeBand/>
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
    );
}

export default ProjectsPage;