import styled from "styled-components";
import { Link } from "react-router-dom";

export const LogoContainer = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  color: inherit;
`;

export const ImgLogo = styled("img")`
  width: 14rem;
  display: block;

  @media (max-width: 767px) {
    width: 2.9rem;
  }
`;

export const LogoText = styled.span`
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #424242;

  @media (max-width: 767px) {
    font-size: 1.15rem;
  }
`;
