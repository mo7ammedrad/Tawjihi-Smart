import styled from "styled-components";


export const AnimationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin: 100px  0px;
  background-color: ${({ theme }) => theme.background_secondary};


  @media (max-width: 767px) {
     
      flex-direction: column;
      text-align: center;
    
  }
`;



export const Info = styled.div`

width: 50%;
line-height: 2;


display: flex;
flex-direction: column;
align-items: start;
justify-content: space-between;

  @media (max-width: 767px) {
     
   width: 100%;
   align-items: center;

    
  }

`