interface PaginationProps {
  currentPage: number;
  totalPages: number; // the total number of pages available based on the total number of projects and the page size
  pageSize: number;
  onPageChange: (pageNum: number) => void; // function to call when the page number is changed, which will update the current page state in the parent component
  onPageSizeChange: (pageSize: number) => void; // function to call when the page size is changed, which will update the page size state in the parent component
}

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  return (
    <div className="flex item-center justify-center mt-4">
      {/* // pagination controls -> disable the "Previous" button if the user is on the 1st page and disable the "Next" button if the user 
          //      is on the last page; when a page number button is clicked, update the pageNum state to the corresponding page number */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      {/* // create an array of the total number of pages and map over it to create a button for each page; the key for each button
      //    is the page number (i + 1) and the onClick handler sets the pageNum state to the corresponding page number when clicked
      // disable the button for the current page (pageNum === i + 1) to indicate which page the user is currently on */}
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          disabled={currentPage === i + 1}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>

      <br />
      <label>
        Results per page:
        {/* when a page size is selected, update the pageSize state with the new value; convert to a number using Number()  */}
        <select
          value={pageSize}
          onChange={(p) => {
            onPageSizeChange(Number(p.target.value));
            onPageChange(1); // reset to the first page whenever the page size changes
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
    </div>
  );
};

export default Pagination;
