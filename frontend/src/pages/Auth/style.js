import { Link } from "react-router-dom";
import styled, {css} from "styled-components";

// Auth Wrapper
export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 2rem;
  gap: 1rem;



  @media (max-width: 1024px) {
    flex-direction: column-reverse;
    padding: 1rem;

  }
`;

// Navigation Tabs
export const UlWrapper = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;

  & li {
    margin: 0 10px;
  }

  @media (max-width: 576px) {
    & li {
      margin: 10px;
    }
  }
`;

// Active Link
export const StyledNavLink = styled(Link)`
  position: relative;
  padding: 10px 15px;
  text-decoration: none;
  color: #555;
  font-weight: 500;
  transition: all 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    transform-origin: center;
    width: 80%;
    height: 2px;
    background: ${({ theme }) => theme.linearGradient};
    transition: transform 0.3s ease;
  }

  &:hover {
    color: transparent;
    background: ${({ theme }) => theme.linearGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      font-weight: bold;
      color: transparent;
      background: ${theme.linearGradient};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

      &::after {
        transform: translateX(-50%) scaleX(1);
      }
    `}
`;