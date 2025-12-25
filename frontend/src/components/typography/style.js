import styled from "styled-components";

export const PargType = styled.p`
  font-size: 2rem; 
  color: ${(props) => props.color || "#000"};
  font-family: "Arial", sans-serif;
  overflow: hidden;
  white-space: nowrap;
  margin: auto;
  padding: 0;
  margin-top: 50px ;
  margin-bottom: -50px;

  /* Typing animation */
  animation: typing 6s 1s forwards;

  @keyframes typing {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }

  /* Responsive font size for small screens */
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;


export const Pargraph = styled.p`
opacity: 0.7;
font-size: 18px;
word-wrap: 20px;
margin: 0px 0 3px 0;
display: flex;


  font-size: ${(props) => props.size || "14px"};

`

