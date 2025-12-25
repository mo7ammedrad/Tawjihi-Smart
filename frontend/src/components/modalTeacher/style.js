import styled from "styled-components";

export const ModalDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  width: 60%;
  max-height: 80vh;  /* limit modal height */
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  transition: all 0.5s ease;

  &.show {
    opacity: 1;
    pointer-events: auto;
    transform: translate(-50%, -50%);
    visibility: visible;
  }

  &.hide {
    opacity: 0;
    pointer-events: none;
    transform: translate(-150%, -50%);
    visibility: hidden;
  }

  @media (max-width: 767px) {
    width: 80%;
    max-height: 90vh; /* slightly taller on small screens */
  &.hide {
   display: none;
  }
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  max-height: 70vh;    /* limit form height inside modal */
  overflow: auto;      /* scroll if content too big */

  /* Optional: nice scroll behavior */
  scrollbar-width: thin;
  scrollbar-color: #888 #eee;

  &::-webkit-scrollbar {
    width: 8px;
    margin: 0px 20px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #eee;
  }
`;


export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.checkBorder};
`;

export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

export const Textarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
`;

export const Button = styled.button`
  padding: 0.6rem 1.2rem;
  background-color: ${props => props.theme.checkBorder};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100px;
  font-size: 18px;
`;

export const CancelButton = styled(Button)`
  background-color: #ccc;
  color: black;
`;

export const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;


