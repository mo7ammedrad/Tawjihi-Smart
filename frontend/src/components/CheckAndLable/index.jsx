// style
import {
  CheckAndLabelContainer,
  CheckAndLabelWrapper,
  HiddenCheckBox,
  StyledLabel,
} from "./style";



export const CheckAndLabel = ({
  text,
  id,
  onChange,
  defaultChecked = false,
}) => {
  return (
    <CheckAndLabelContainer>
      <CheckAndLabelWrapper>
        <HiddenCheckBox
          type="checkbox"
          id={id}
          onChange={onChange}
          defaultChecked={defaultChecked}
        />
        <StyledLabel htmlFor={id}>{text}</StyledLabel>
      </CheckAndLabelWrapper>
    </CheckAndLabelContainer>
  );
};
