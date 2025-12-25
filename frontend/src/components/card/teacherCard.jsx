//react
import { useNavigate } from "react-router-dom";

//style
import {
  Card,
  Badge,
  BadgeIcon,
  ImageSection,
  GlowEffect,
  Avatar,
  NameSection,
  NameUnderline,
  Description,
  RatingSection,
  Stars,
  HoverOverlay,
} from "./style";

import {
  AvatarImageTeacher,
  AvatarPlaceholderTeacher,
  CardContentTeacher,
  RatingTextTeacher,
  TeacherNameTeacher,
} from "./style";

//components
import { StarIcon } from "../Star";

export const TeacherCard = ({
  imgSrc,
  name,
  desc,
  starIcon = 0,
  id,
  badge,
}) => {
  const navigate = useNavigate();
  const fullStars = Math.floor(starIcon);
  const hasHalfStar = starIcon % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`full-${i}`} filled={true} />);
    }

    if (hasHalfStar) {
      stars.push(<StarIcon key="half" half={true} />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} filled={false} />);
    }

    return stars;
  };

  const handleClick = () => navigate(`/teachers/${id}`);
  const handleKeyDown = (e) =>
    (e.key === "Enter" || e.key === " ") && handleClick();

  return (
    <Card
      onClick={handleClick}
      tabIndex={0}
      role="button"
      onKeyDown={handleKeyDown}
    >
      {badge && (
        <Badge>
          <BadgeIcon
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88" />
          </BadgeIcon>
          {badge}
        </Badge>
      )}

      <CardContentTeacher>
        {imgSrc !== undefined && imgSrc !== null ? (
          <ImageSection>
            <GlowEffect />
            <Avatar>
              {imgSrc ? (
                <AvatarImageTeacher
                  src={imgSrc}
                  alt={`صورة تخص ${name || "المعلم"}`}
                />
              ) : (
                <AvatarPlaceholderTeacher
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </AvatarPlaceholderTeacher>
              )}
            </Avatar>
          </ImageSection>
        ) : null}{" "}
        <NameSection>
          <TeacherNameTeacher>{name}</TeacherNameTeacher>
          <NameUnderline />
        </NameSection>
        {desc && <Description>{desc}</Description>}
        <RatingSection>
          <Stars>{renderStars()}</Stars>
          <RatingTextTeacher>({starIcon.toFixed(1)})</RatingTextTeacher>
        </RatingSection>
        <HoverOverlay />
      </CardContentTeacher>
    </Card>
  );
};
