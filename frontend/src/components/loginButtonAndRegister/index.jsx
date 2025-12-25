// style
import { ButtonLogin } from "./style";

export const LoginAndRegisterButton = ({
  fontSize,
  color,
  padding,
  children,
  onClick,
  isDisabled
}) => {
  return (
    <div>
      <ButtonLogin onClick={onClick} style={{ color, fontSize, padding }} disabled={isDisabled}>
        {children}
      </ButtonLogin>
    </div>
  );
};
