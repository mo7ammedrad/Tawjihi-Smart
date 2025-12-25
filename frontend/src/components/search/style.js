import styled from "styled-components";

export const WrapperSearch = styled.div`
  background-color: transparent;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 100px 0px;

`;

export const SvgICon = styled.svg`
  width: 40px;
  height: 50px;
  outline: none;
  cursor: pointer;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: #fff;
  fill: ${props => props.theme.checkBorder};
;
    transition: all 0.5s linear;

  &.iconBar {
    /* optional additional styles */
  }
`;

export const InputBar = styled.input`
  width: 60%;
  height: 50px;
  border: none;
  outline: none;
  font-size: 20px;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  padding: 0px 15px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
    transition: all 0.5s linear;

  &::placeholder {
    font-size: 18px;
  }

  @media (max-width: 768px) {
    width: 80%;    
  }
`;

export const SuggestionBox = styled.ul`
  position: absolute;
  top: 110%; /* places it just below the input */
  right: 20%; /* aligns to the right of the input */
  width: 50%; /* or use a fixed width like 300px */
  background: white;
    color : ${props => props.theme.checkBorder};
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 99;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const SuggestionItem = styled.li`
  padding: 10px 16px;
  width: 100%;
  cursor: pointer;
  transition: background 0.2s;
  text-align: start;

  &:hover {
    background-color: #f1f5f9;
  }
`;
