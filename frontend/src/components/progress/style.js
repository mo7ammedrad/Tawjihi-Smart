import styled from "styled-components";

export const ProgressWrapper = styled.div`
width: 60%;
height: 5px;
background-color: #f9f9f9;
position: relative;
border-radius: 8px;

&:before {
  content: "";  
    position: absolute;
    width: 30%;
    height: 100%;
    background-color: var(--color-primary);
    transition: width 0.3s ease-in-out;
    right: 0;
    top: 0;
    border-radius: 8px;
    
}
`