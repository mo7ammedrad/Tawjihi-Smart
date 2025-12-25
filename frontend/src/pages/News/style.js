import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
`;

export const Header = styled.div`
  padding: 32px 0 12px;
  h1 {
    margin: 0;
    font-size: 32px;
  }
  p {
    margin: 8px 0 0;
    opacity: 0.8;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
`;

export const Card = styled.article`
  grid-column: span 12;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 160px 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Cover = styled.div`
  background: rgba(0, 0, 0, 0.08);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const Content = styled.div`
  padding: 14px 16px;
  h3 {
    margin: 0;
    font-size: 18px;
  }
  .meta {
    margin-top: 6px;
    font-size: 12px;
    opacity: 0.7;
  }
  .body {
    margin-top: 10px;
    font-size: 14px;
    line-height: 1.6;
    opacity: 0.9;
  }
`;

