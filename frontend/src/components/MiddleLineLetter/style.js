import styled from "styled-components";

export const MiddleLineLetterStyle = styled.div`
  width: 100%;
  height: 2px;
  background: ${({theme}) => theme.linearGradient};
  margin: 30px auto;
  position: relative;

  & > span {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${({theme}) => theme.background};
    padding: 0 10px;
    font-size: 14px;
    color: ${({theme}) => theme.color};
    white-space: nowrap;
  }
`;
