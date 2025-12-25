// Import libraries
import Lottie from "lottie-react";
import styled from "styled-components";

// Import animation JSON
import RegisterAnim from "../../assets/animations/login.json";

// Styled component for responsive container
const StyledLottie = styled(Lottie)`
  width: 500px;
  height: 500px;

  @media (max-width: 768px) {
    width: 350px;
    height: 350px;
  }
`;

export const RegisterAnimation = () => {
  return <StyledLottie animationData={RegisterAnim} loop={true} />;
};
