// style
import {
  SkeletonAvatar,
  SkeletonLineShort,
  SkeletonPrice,
  SkeletonStars,
  SkeletonStarsPrice,
  SkeletonTeacherName,
  SkeletonWrapper,
  TeacherInfoWrapper,
} from "./style";

export const CardSkeleton = () => {
  return (
    <SkeletonWrapper>
      {/* Image skeleton */}
      <SkeletonAvatar />
      {/* Course name */}

      <SkeletonLineShort />
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* subjet */}

        <SkeletonLineShort />

        {/* branch */}
        <SkeletonLineShort />
      </div>

      {/* Teacher info */}
      <TeacherInfoWrapper>
        {/* <SkeletonTeacherImg /> */}
        <SkeletonTeacherName />
      </TeacherInfoWrapper>

      {/* Stars and Price */}
      <SkeletonStarsPrice>
        <SkeletonStars />
        <SkeletonPrice />
      </SkeletonStarsPrice>
    </SkeletonWrapper>
  );
};
