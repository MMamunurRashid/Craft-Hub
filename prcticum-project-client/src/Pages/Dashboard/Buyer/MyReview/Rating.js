import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

// Assume this is the RatingInput component you've created
 export const Rating = ({ rating }) => (
  <div className="flex items-center mt-4">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={star <= rating ? "text-yellow-500" : "text-gray-300"}
      >
        {star <= rating ? (
          <AiFillStar className="w-6 h-6" />
        ) : (
          <AiOutlineStar className="w-6 h-6" />
        )}
      </span>
    ))}
  </div>
);