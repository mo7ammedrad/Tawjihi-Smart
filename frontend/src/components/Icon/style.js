import styled from "styled-components";

// Styled component
export const SocialWrapper = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  

  svg, img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

export const CourseIconWrapper = styled.div`
  display: flex; 
  align-items: center;

  & img {
    width: 20px;
    height: 20px;

  }
  `