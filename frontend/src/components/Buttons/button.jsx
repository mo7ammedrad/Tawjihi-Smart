//style
import { ButtonStyled } from "./style";

export const Button = ({ children, onClick }) => {
  return (
    <ButtonStyled type="button" onClick={onClick}>
      {children}
    </ButtonStyled>
  );
};
