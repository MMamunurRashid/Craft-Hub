import React, { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

export const RatingInput = ({ onRatingChange, initialRating }) => {
  const [rating, setRating] = useState(initialRating || 0);

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
    onRatingChange(selectedRating); // Notify the parent component about the rating change
  };

  return (
    <div className="flex items-center mt-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleStarClick(star)}
          className={star <= rating ? "text-yellow-500" : "text-gray-300"}
        >
          {star <= rating ? (
            <AiFillStar className="w-6 h-6 cursor-pointer" />
          ) : (
            <AiOutlineStar className="w-6 h-6 cursor-pointer" />
          )}
        </span>
      ))}
    </div>
  );
};