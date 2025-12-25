import styled from "styled-components";

// Form Layout
export const Form = styled.form`
  width: 100%;
  max-width: 400px;
  margin: -10px auto;
  background: ${({ theme }) => theme.background};
  padding: 1.5rem;
  border-radius: 1rem;

  @media (max-width: 576px) {
    padding: 0.5rem;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 0.5rem;
`;

export const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  background: ${({ theme }) => theme.linearGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 1rem;
  color: var(--color-text);

  &:focus {
    outline: none;
    border-color: var(--color-link);
    background-color: white;
  }
`;

export const ErrorText = styled.div`
  margin-top: 0.2rem;
  color: red;
  font-size: 0.875rem;
  padding: 0.5rem;
  border-radius: 0.4rem;
`;

export const Button = styled.button`
  width: 100%;
  padding: 0.8rem 1.5rem;
  background: ${({ theme }) => theme.linearGradient};
  color: white;
  border: none;
  border-radius: 0.6rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-primary-hover);
  }
`;

export const PasswordRulesList = styled.ul`
  list-style: none;
  padding: 0 1rem;
  margin: 0.5rem 0;
`;

export const PasswordRuleItem = styled.li`
  color: ${(props) => (props.$valid ? "var(--color-success-text)" : "red")};
  font-weight: ${(props) => (props.$valid ? "bold" : "normal")};
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;

  @media (max-width: 576px) {
    justify-content: center;
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 20px;

  @media (max-width: 576px) {
    gap: 0.75rem;
  }
`;

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

export const CheckboxLabel = styled(Label)`
  margin: 0;
  cursor: pointer;
`;



export const FormForgetPassword = styled(Form)`
  border: 1px solid var(--color-primary);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  padding: 2rem;
  width: 100%;
  max-width: 400px;

  @media (max-width: 576px) {
    padding: 1rem;
    max-width: 90%;
    align-items: start;

    & input {
      width: 100%;
    }

    & label {
      width: 100%;
      text-align: right;
    }
  }

  & label {
    margin: 5px 0px;
  }

  & input {
    width: 100%;
  }
`;


