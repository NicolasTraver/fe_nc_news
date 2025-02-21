import React from "react";

function SortingControls({ sortBy, order, onSortChange }) {
  const handleSortByChange = (event) => {
    const newSortBy = event.target.value;
    onSortChange(newSortBy, order);
  };
  const handleOrderChange = (event) => {
    const newOrder = event.target.value;
    onSortChange(sortBy, newOrder);
  };

  return (
    <div className="sorting-controls">
      <label>
        Sort by:
        <select value={sortBy} onChange={handleSortByChange}>
          <option value="created_at">Date</option>
          <option value="votes">Votes</option>
          <option value="comment_count">Comment Count</option>
        </select>
      </label>
      <label>
        Order:
        <select value={order} onChange={handleOrderChange}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </label>
    </div>
  );
}

export default SortingControls;
