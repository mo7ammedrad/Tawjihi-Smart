//global style 
import styled from "styled-components";

export const WrapperNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
  background-color: var(--color-background); 
  padding: 0.5rem 1rem;
  ${(props) => props.theme ? `background-color : ${props.theme.background};
    color : ${props.theme.color}` : ''}
`;

export const WrapperElementFlexCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const WrapperElementFlexSpace = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 767px) {
    justify-content: space-around;
  align-items: start;
  }
`;
