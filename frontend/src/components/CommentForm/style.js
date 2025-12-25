import styled from "styled-components";

export const LeaveCommentWrapper = styled.div`
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 14px;
  resize: vertical;
`;


export const SubmitButton = styled('button')`
  align-self: flex-end;
  padding: 10px 24px;
  font-size: 15px;
  border-radius: 8px;
  text-transform: none;
  box-shadow: none;
  border: none;
  color: #fff;
  background-color: #1976d2;
  transition: background-color 0.3s ease;
  margin-top: 15px;
  cursor: pointer;

  &:hover {
    background-color: #155fa0;
  }

  &:disabled {
    background-color: #b0b0b0;
    cursor: not-allowed;
  }
`;

