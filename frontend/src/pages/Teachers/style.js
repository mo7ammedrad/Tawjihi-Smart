import styled from "styled-components";

export const StyledTeachersPage = styled.div`
  & section > div {
    display: flex;
    padding: 20px 0;
    flex-direction: column;
  }

  & .teachers {
    & div.teachers-list {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 2%;
      row-gap: 15px;

      & > div {
        flex: 1 1 calc(33.333% - 2%);
        box-sizing: border-box;
        margin: 0;
      }
    }

  }



& .num-of-pages{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 0px;
    
    & span {
        padding: 0px 5px;
    }
}



  /* Tablet (≤ 768px) */
  @media (max-width: 768px) {
    & .teachers div.teachers-list > div {
      flex: 1 1 calc(50% - 2%);
    }
  }

  /* Mobile (≤ 480px) */
  @media (max-width: 480px) {
    & .teachers div.teachers-list > div {
      flex: 1 1 100%;
    }

    & .teachers div.pagination button {
      padding: 6px 12px;
      font-size: 12px;
    }
  }
`;
