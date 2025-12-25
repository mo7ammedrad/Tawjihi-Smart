import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: "Amiri", sans-serif;
    line-height: 1.6;
    direction: rtl;
    overflow-x: hidden;
    transition: all 0.3s ease;
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.color};
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${(props) => props.theme.color};
  }

  a {
    color: ${(props) => props.theme.link || "#007bff"};
    text-decoration: none;
  }
  a:hover {
    color: ${(props) => props.theme.linkHover || "#0056b3"};
    text-decoration: underline;
  }

  ul {
    list-style: none;
  }

  .button-primary {
    background-color: ${(props) => props.theme.primary || "#81d4fa"};
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }

  .button-primary:hover {
    background-color: ${(props) => props.theme.primaryHover || "#0056b3"};
  }
`;
