//react
import { useState } from "react";
import { FaStar } from "react-icons/fa";

export const StarRating = ({ totalStars = 5 }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ display: "flex", gap: "4px", cursor: "pointer" }}>
      {[...Array(totalStars)].map((_, index) => {
        const current = index + 1;
        return (
          <FaStar
            key={index}
            size={22}
            color={current <= (hovered || rating) ? "#ffc107" : "#e4e5e9"}
            onClick={() => setRating(current)}
            onMouseEnter={() => setHovered(current)}
            onMouseLeave={() => setHovered(null)}
            style={{ transition: "color 0.2s" }}
          />
        );
      })}
    </div>
  );
};
