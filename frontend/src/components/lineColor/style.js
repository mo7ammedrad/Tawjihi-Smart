import styled from "styled-components";

export const ColorDiv = styled.div`

width: 20%;
margin:auto;
height: 1px;
background-color:rgb(197, 198, 214);
position: relative;

&::after{
    content:  '';
    position: absolute;
width: 30%;
background-image: ${({ theme }) => theme.linearGradient };
height: inherit;
top: 50%;
left: 50%;
transform: translate(-50%,-50%);
}

@media (max-width: 767px) {
    width: 60%;
}

`