// components/Loading/SkeletonTeacherStyle.js
import styled, { keyframes, css } from "styled-components";

// ✅ Shimmer animation keyframes
const shimmer = keyframes`
  0% { background-position: -300px 0; }
  100% { background-position: 300px 0; }
`;

// ✅ Correct way to define shared skeleton effect
const skeletonEffect = css`
  background: #f0f0f0;
  background-image: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #e0e0e0 40px,
    #f0f0f0 80px
  );
  background-size: 600px 100%;
  animation: ${shimmer} 1.5s infinite;
`;

export const SkeletonTeacherWrapper = styled.div`
  min-width: 30%;
  padding: 24px 16px 28px;
  border-radius: 24px;
  background-color: #ffffff;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin: 20px auto;

  @media (max-width: 767) {
    max-width: 100%;
  }
`;

export const SkeletonTeacherBadge = styled.div`
  ${skeletonEffect};
  position: absolute;
  top: -12px;
  right: -12px;
  width: 60px;
  height: 24px;
  border-radius: 999px;
`;

export const SkeletonTeacherImage = styled.div`
  ${skeletonEffect};
  width: 170px;
  height: 170px;
  border-radius: 50%;
  margin-bottom: 16px;
`;

export const SkeletonTeacherName = styled.div`
  ${skeletonEffect};
  width: 60%;
  height: 20px;
  margin-bottom: 6px;
  border-radius: 6px;
`;

export const SkeletonTeacherUnderline = styled.div`
  ${skeletonEffect};
  width: 40px;
  height: 2px;
  margin-bottom: 18px;
  border-radius: 2px;
`;

export const SkeletonTeacherDesc = styled.div`
  ${skeletonEffect};
  width: 80%;
  height: 14px;
  margin-bottom: 20px;
  border-radius: 4px;
`;

export const SkeletonTeacherStars = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
`;

export const SkeletonTeacherStar = styled.div`
  ${skeletonEffect};
  width: 20px;
  height: 20px;
  border-radius: 4px;
`;
