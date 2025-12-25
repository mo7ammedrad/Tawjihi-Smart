import styled from "styled-components";

export const ReviewSection = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-top: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ReviewCard = styled.div`
  display: flex;
  gap: 16px;
  background-color: ${({ theme }) => theme.background};
  padding: 16px;
  border-radius: 10px;
`;

export const AvatarCircle = styled.div`
  background-color: #3f51b5;
  color: white;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
`;

export const ReviewContent = styled.div`
  flex: 1;
`;

export const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;


`;

export const ReviewerName = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.color};
`;

export const ReviewText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.color};
  margin: 0;
  line-height: 1.6;
`;

export const ReviewActions = styled.div`
  display: flex;
  gap: 8px;

  & svg {
    color: rgba(118, 75, 162, 0.9);
    cursor: pointer;
  }
   `
