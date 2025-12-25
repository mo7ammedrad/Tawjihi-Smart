//style
import { CourseIconWrapper } from "./style";

//MUI Library
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";

export const CourseIcon = ({ icon, text }) => {
  return (
    <CourseIconWrapper>
      {icon === "clock" && <AccessTimeIcon fontSize="small" />}

      {icon === "star" && <StarIcon fontSize="small" />}

      <span>{text}</span>
    </CourseIconWrapper>
  );
};
