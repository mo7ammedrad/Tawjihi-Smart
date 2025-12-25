import styled from "styled-components";

export const ButtonStyled = styled.button`
background-image: ${({ theme }) => theme.linearGradient};
  color: #fff;
  padding: 0.8rem 1.6rem;
  margin: 20px 0;
  font-size: 1.1rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.linkHover};
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 86, 179, 0.3);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 3px 8px rgba(0, 86, 179, 0.2);
  }

  &:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
  }
`;

export const StyledDownloadButton = styled(ButtonStyled).attrs({ as: 'a' })`
text-decoration: none;
display: inline-block;
&:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 86, 179, 0.3);
    color: #fff;
    text-decoration: none;

  }
`
