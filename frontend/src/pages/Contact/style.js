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

export const Form = styled.form`
  max-width: 680px;
  display: grid;
  gap: 14px;
  padding: 16px 0 30px;
`;

export const Field = styled.div`
  display: grid;
  gap: 8px;
  label {
    font-size: 14px;
    opacity: 0.85;
  }
  input,
  textarea {
    width: 100%;
    border-radius: 12px;
    padding: 12px 14px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.06);
    color: inherit;
    outline: none;
  }
  textarea {
    min-height: 140px;
    resize: vertical;
  }
`;

export const Submit = styled.button`
  border: 0;
  border-radius: 12px;
  padding: 12px 14px;
  background: linear-gradient(90deg, #00c6ff, #0072ff);
  color: white;
  font-weight: 700;
  cursor: pointer;
  opacity: ${(p) => (p.disabled ? 0.7 : 1)};
`;

