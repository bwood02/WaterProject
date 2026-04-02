import { useEffect, useState } from "react";
import './CategoryFilter.css'; // import the CSS file for styling the category filter component

function CategoryFilter ( 
    // pass in the selectedCategories state and the setSelectedCategories function as props from the App component, allowing this component to read and update the selected categories
    { selectedCategories, setSelectedCategories }: 
    { selectedCategories: string[]; setSelectedCategories: (categories: string[]) => void }) 
{
    const [categories, setCategories] = useState<string[]>([]); // state for the string list of categories, initialized as an empty array

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`https://waterproject-wood-backend-b0f0g2gtf9hsgfeu.centralus-01.azurewebsites.net/water/getprojecttypes`); 
                const data = await response.json(); 
                console.log("Fetched categories:", data); // log the fetched categories to the console for debugging purposes
                setCategories(data); // set the categories state to the data received from the backend
            } 
            catch (error) {
                console.error("Error fetching categories:", error); // could post this somewhere other than the console
            }
        }

        fetchCategories();
    }, []);

    // target is the checkbox input element that triggered the change event; we can access HTMLInputElement properties (like checked and value) through the target parameter
    function handleCheckboxChange ({target}: {target: HTMLInputElement})  {
        const updatedCategories = selectedCategories.includes(target.value) // see if the selected category is already checked (in selectedCategories)
            ? selectedCategories.filter((c) => c !== target.value) // if true (?), remove the category from the selectedCategories array
            : [...selectedCategories, target.value]; // if false (:), we create a new array that adds the value of the checkbox that was checked (target.value)
        setSelectedCategories(updatedCategories); 
    } 
    
    return (
        <div className="category-filter">
            <h5>Project Types</h5>
            <div className="category-list">
                {categories.map((c) => (
                    // c is the category name
                    <div key={c} className="category-item">
                        <input 
                            type="checkbox" 
                            id={c} 
                            value={c} 
                            className="category-checkbox"
                            onChange={handleCheckboxChange}
                        /> 
                        <label htmlFor={c}>{c}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryFilter;