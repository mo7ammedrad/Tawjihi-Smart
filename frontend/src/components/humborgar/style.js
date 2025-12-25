import styled from "styled-components";

const StyledHamburger = styled.div`
  width: 30px;
  height: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  z-index: 1001;

  div {
    width: 100%;
    height: 4px;
background-image: ${({ theme }) => theme.linearGradient};
    border-radius: 4px;
    transition: all 0.3s ease-in-out;
    transform-origin: 1px;
  }

  div:nth-child(1) {
    transform: ${({ $isOpen }) => ($isOpen ? "rotate(45deg)" : "rotate(0)")};
  }

  div:nth-child(2) {
    opacity: ${({ $isOpen }) => ($isOpen ? "0" : "1")};
  }

  div:nth-child(3) {
    transform: ${({ $isOpen }) => ($isOpen ? "rotate(-45deg)" : "rotate(0)")};
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

export default StyledHamburger;


