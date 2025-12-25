//style
import styled from "styled-components";

//css container
const Container = styled.div`
  width: 80%;
  margin: auto;
`;

export const Containers = ({ children }) => {
  return <Container>{children}</Container>;
};
