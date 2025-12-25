import styled from "styled-components";

export const FooterWrapper = styled.footer`
  background-color:${({ theme }) => theme.heading};
  color: #fff;
  padding: 20px 20px;
  direction: rtl;
  margin-top: 20px;

  & a{
    color: #fff;
  }

    @media (max-width:767px) {
    text-align: center;
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: space-between;

`;

export const Section = styled.div`
  flex: 1;
  min-width: 200px;
`;

export const Logoo = styled.h2`
  color: var(--color-primary);

`;

export const Title = styled.h3`
 
/* for the linearGradient */
    background: ${(props) => props.theme.linearGradient}; /* You can customize colors and direction */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    /* For Firefox */
    background-clip: text;
    color: transparent;  

  margin-bottom: 10px;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  
`;

export const ListItem = styled.li`
  margin-bottom: 3px;
`;


export const Bottom = styled.div`
  text-align: center;
  padding-top: 10px;
  font-size: 0.9rem;
  color: #888;
  border-top: 1px solid #444;
  margin: 5px 0px;
 
`;