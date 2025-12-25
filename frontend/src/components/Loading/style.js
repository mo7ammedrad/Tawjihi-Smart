import styled, { keyframes } from "styled-components";

// Spinner rotation
const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

// Bounce animation for dots
const bounce = keyframes`
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f9fbfd;
  padding: 2rem;
  text-align: center;
`;


export const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: relative;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 2rem;
  background: ${({ theme }) => theme.linearGradient};

  &::before {
    content: "";
    position: absolute;
    top: 6px;
    left: 6px;
    right: 6px;
    bottom: 6px;
    background: white;
    border-radius: 50%;
  }
`;



export const LoadingText = styled.div`
  font-size: 1.5rem;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const BounceDot = styled.span`
  font-size: 2rem;
  margin: 0 2px;
  animation: ${bounce} 1.2s infinite;
  animation-delay: ${(props) => props.delay};

  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
`;





// reuse shimmer keyframe and styles
export const shimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

export const SkeletonWrapper = styled.div`
  min-width: 30%;
  padding: 16px;
  border-radius: 8px;
  background: transparent;

  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SkeletonElement = styled.div`
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%);

  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

export const SkeletonAvatar = styled(SkeletonElement)`
  width: 100%;
  height: 150px;
  border-radius: 10px;
`;

export const SkeletonLine = styled(SkeletonElement)`
  height: 16px;
  width: 100%;
`;

export const SkeletonLineShort = styled(SkeletonLine)`
  width: 30%;
`;

export const TeacherInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
`;

// Circle for teacher image skeleton
export const SkeletonTeacherImg = styled(SkeletonElement)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
`;

export const SkeletonTeacherName = styled(SkeletonLineShort)`
  width: 120px;
  height: 16px;
`;

export const SkeletonStarsPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

export const SkeletonStars = styled(SkeletonLineShort)`
  width: 100px;
  height: 16px;
`;

export const SkeletonPrice = styled(SkeletonLineShort)`
  width: 60px;
  height: 16px;
`;


export const StyledSkeletonComment = styled(SkeletonElement)`
  
`