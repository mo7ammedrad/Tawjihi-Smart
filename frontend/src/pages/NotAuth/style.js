import styled from "styled-components";
import { Link } from "react-router-dom";

export const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  min-height: 100vh;
  background-color: #f8f9fc;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 3rem;
  color: #ff4757;
  margin-bottom: 1rem;
`;

export const Description = styled.p`
  font-size: 1.25rem;
  color: #2f3542;
  margin-bottom: 2rem;
`;

export const BackButton = styled(Link)`
 background-color:${props => props.theme.checkBorder};  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background-color:${props => props.theme.checkBorder};
    color: white;}
`;
