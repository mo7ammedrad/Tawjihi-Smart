// components/Loading/SkeletonTeacherCard.jsx
import {
  SkeletonTeacherWrapper,
  SkeletonTeacherImage,
  SkeletonTeacherBadge,
  SkeletonTeacherName,
  SkeletonTeacherUnderline,
  SkeletonTeacherDesc,
} from "./SkeletonTeacherStyle";

export const SkeletonTeacherCard = () => {
  return (
    <SkeletonTeacherWrapper>
      <SkeletonTeacherBadge />
      <SkeletonTeacherImage />
      <SkeletonTeacherName />
      <SkeletonTeacherUnderline />
      <SkeletonTeacherDesc />
      <SkeletonTeacherName />
    </SkeletonTeacherWrapper>
  );
};
