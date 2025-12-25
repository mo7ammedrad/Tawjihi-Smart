import styled from "styled-components"

export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 16px;
  margin: 20px 0;
  gap: 16px;

  p {
    color: ${({ theme }) => theme.color || "#6c757d"};
    font-size: 16px;
    margin: 0;
  }
`

export const VideoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 24px;
  background: ${({ theme }) => theme.background_secondary || "white"};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
`

export const VideoTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.color || "#2c3e50"};
  margin: 0 0 8px 0;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`

export const VideoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.color || "#6c757d"};
  font-size: 14px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`

export const VideoCounter = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
`

export const NavigationHint = styled.div`
  background: ${({ theme }) => theme.background || "#f8f9fa"};
  color: ${({ theme }) => theme.color || "#6c757d"};
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  border: 1px solid ${({ theme }) => theme.border || "#e1e8ed"};

  @media (max-width: 768px) {
    font-size: 12px;
  }
`

export const VideoContent = styled.div`
  margin-bottom: 32px;
`

export const VideoWrapper = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`

export const PlayerSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const PlayerContainer = styled.div`
  background: ${({ theme }) => theme.background_secondary || "white"};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid ${({ theme }) => theme.border || "#e1e8ed"};

  iframe {
    width: 100%;
    height: 500px;
    border: none;
    display: block;

    @media (max-width: 768px) {
      height: 300px;
    }
  }
`

export const PlaylistSection = styled.div`
  flex: 1;
  min-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 1024px) {
    min-width: unset;
  }
`

export const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.color || "#2c3e50"};
  margin: 0;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`

export const ListContainer = styled.div`
  background: ${({ theme }) => theme.background_secondary || "white"};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.border || "#e1e8ed"};
  overflow: hidden;
  max-height: 600px;
`

export const ReviewSection = styled.div`
  background: ${({ theme }) => theme.background_secondary || "white"};
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.border || "#e1e8ed"};
  margin-bottom: 30px;

  .reviews-content {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .comment-form-section {
    padding-top: 24px;
    border-top: 2px solid ${({ theme }) => theme.border || "#e1e8ed"};

    h4 {
      font-size: 18px;
      font-weight: 600;
      color: ${({ theme }) => theme.color || "#2c3e50"};
      margin: 0 0 16px 0;
    }
  }
`

export const NoContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 40px 20px;
`

export const EnrollmentMessage = styled.div`
  text-align: center;
  background: ${({ theme }) => theme.background_secondary || "white"};
  padding: 48px 32px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.border || "#e1e8ed"};
  max-width: 500px;

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme.color || "#2c3e50"};
    margin: 0 0 12px 0;
  }

  p {
    font-size: 16px;
    color: ${({ theme }) => theme.color || "#6c757d"};
    line-height: 1.6;
    margin: 0 0 24px 0;
  }

  button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
  }
`

// Legacy exports for backward compatibility
export const PageWrapper = styled.section`
  padding: 20px;
`

export const StyledCourseWrapper = styled.section`
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.background_secondary};
  border-radius: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
  margin: 15px 0px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export const CourseImage = styled.img`
  width: 35%;
  min-width: 250px;
  border-radius: 8px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100%;
  }
`

export const DetailsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const MetaInfo = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`

export const StartButtonWrapper = styled.div`
  align-self: flex-start;
  margin-top: 20px;
`

export const Label = styled.span`
  font-weight: 500;
  font-size: 16px;
`

export const WatchText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.color};
`

export const LeftWrapper = styled.div`
  flex: 1 1 60%;
  min-width: 300px;
  max-width: 800px;
  background-color: ${({ theme }) => theme.background};
`

export const RightWrapper = styled.div`
  flex: 1 1 35%;
  min-width: 250px;
  max-width: 350px;
`

export const Container = styled.div`
  width: 100%;
  display: flex;
  gap: 24px;
  align-items: flex-start;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 15px 0px;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`

export const AboutCourseDiv = styled(StyledCourseWrapper)``
