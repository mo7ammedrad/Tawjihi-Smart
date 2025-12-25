import styled, { keyframes } from "styled-components";


const HeaderSection = styled.div`
  position: relative;
  height: 12rem;
  background: linear-gradient(90deg, #2563eb 0%, #9333ea 100%);
  overflow: hidden;

  @media (min-width: 768px) {
    height: 16rem;
  }
`;




const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.2;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
`;

const ProfileSection = styled.div`
  position: relative;
  padding: 0 1rem;
  margin-top: -4rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;


const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
`;

const ProfileContent = styled.div`
  padding: 1.5rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
`;

const Avatar = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const UserDetails = styled.div``;

const UserName = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #0f172a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 1.875rem;
  }
`;

const UserEmail = styled.p`
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.25rem 0;
`;

const RoleBadge = styled.span`
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: #f1f5f9;
  color: #475569;
  font-size: 0.875rem;
  border-radius: 9999px;
  font-weight: 500;
`;

const EditButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #2563eb 0%, #9333ea 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: linear-gradient(90deg, #1d4ed8 0%, #7c3aed 100%);
    transform: translateY(-1px);
  }
`;

const SectionCard = styled.div`
  margin-top: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const SectionContent = styled.div`
  padding: 1.5rem;
`;



const SectionDescription = styled.p`
  color: #64748b;
  margin: 0 0 1.5rem 0;
`;

const AboutText = styled.p`
  color: #374151;
  line-height: 1.625;
  margin: 0;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f8fafc;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const DetailIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
`;

const DetailContent = styled.div``;

const DetailLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin: 0;
`;

const DetailValue = styled.p`
  font-weight: 600;
  color: #0f172a;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const StatContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatInfo = styled.div``;

const StatLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin: 0 0 0.25rem 0;
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #0f172a;
  margin: 0;
`;

const StatIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: ${(props) => props.color}1a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const StatBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0.25rem;
  background-color: ${(props) => props.color};
`;

const LastCard = styled(SectionCard)`
  margin-bottom: 2rem;
`;














const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  font-size: 1.25rem;
  padding: 0.25rem;

  &:hover {
    color: #374151;
  }
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`

// Main Container
export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
    pointer-events: none;
  }
`

export const MaxWidthContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`

// Header
export const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.8s ease-out;
`

export const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`

export const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.3rem;
  margin: 0;
  font-weight: 300;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`

// Form Card
export const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  overflow: hidden;
  animation: ${fadeIn} 1s ease-out 0.2s both;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
    background-size: 200% 100%;
    animation: ${shimmer} 3s ease-in-out infinite;
  }
`

export const Form = styled.form`
  padding: 3rem;
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`

// Profile Image Section
export const ProfileImageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 3rem;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
  position: relative;
`

export const ProfileImageContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: scale(1.05) rotate(2deg);
  }
`

export const ProfileImage = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 6px solid ${(props) => (props.hasImage ? "#667eea" : "#e5e7eb")};
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 0 0 4px rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    border-color: #764ba2;
    box-shadow: 
      0 25px 50px rgba(118, 75, 162, 0.3),
      0 0 0 4px rgba(255, 255, 255, 0.9);
  }
  
  &:focus {
    outline: none;
    box-shadow: 
      0 25px 50px rgba(118, 75, 162, 0.3),
      0 0 0 4px rgba(102, 126, 234, 0.5);
  }
`

export const ImageUploadOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  ${ProfileImageContainer}:hover & {
    opacity: 1;
  }
`

export const UploadIcon = styled.div`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  animation: ${pulse} 2s infinite;
`

export const ImageUploadText = styled.p`
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`

export const HiddenInput = styled.input`
  display: none;
`

// Form Sections
export const FormSection = styled.div`
  margin-bottom: 3rem;
  
  &:last-of-type {
    margin-bottom: 2rem;
  }
`

export const SectionTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 2rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, #667eea, transparent);
    margin-left: 1rem;
  }
`

export const FormGrid = styled.div`
  display: grid;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  &.full-width {
    @media (min-width: 768px) {
      grid-column: span 2;
    }
  }
`

// Input Components
export const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

export const IconWrapper = styled.div`
  position: absolute;
  left: 1.2rem;
  z-index: 2;
  font-size: 1.3rem;
  color: #9ca3af;
  transition: all 0.3s ease;
  pointer-events: none;
`

export const FloatingLabel = styled.label`
  position: absolute;
  left: 3.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  background: white;
  padding: 0 0.5rem;
  z-index: 1;
`

export const Input = styled.input`
  width: 100%;
  padding: 1.2rem 1.2rem 1.2rem 4rem;
  border: 2px solid ${(props) => (props.hasError ? "#ef4444" : "#e5e7eb")};
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
    
    + ${FloatingLabel} {
      top: 0;
      font-size: 0.85rem;
      color: #667eea;
      font-weight: 600;
    }
    
    ~ ${IconWrapper} {
      color: #667eea;
      transform: scale(1.1);
    }
  }
  
  &:not(:placeholder-shown) + ${FloatingLabel} {
    top: 0;
    font-size: 0.85rem;
    color: #374151;
    font-weight: 600;
  }
  
  &:hover {
    border-color: #d1d5db;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
    opacity: 0.7;
  }
`

export const Select = styled.select`
  width: 100%;
  padding: 1.2rem 1.2rem 1.2rem 4rem;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
    
    + ${FloatingLabel} {
      top: 0;
      font-size: 0.85rem;
      color: #667eea;
      font-weight: 600;
    }
    
    ~ ${IconWrapper} {
      color: #667eea;
      transform: scale(1.1);
    }
  }
  
  + ${FloatingLabel} {
    top: 0;
    font-size: 0.85rem;
    color: #374151;
    font-weight: 600;
  }
  
  &:hover {
    border-color: #d1d5db;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
    opacity: 0.7;
  }
`

export const TextArea = styled.textarea`
  width: 100%;
  padding: 1.2rem 1.2rem 1.2rem 4rem;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
    
    + ${FloatingLabel} {
      top: 0;
      font-size: 0.85rem;
      color: #667eea;
      font-weight: 600;
    }
    
    ~ ${IconWrapper} {
      color: #667eea;
      transform: scale(1.1);
    }
  }
  
  &:not(:placeholder-shown) + ${FloatingLabel} {
    top: 0;
    font-size: 0.85rem;
    color: #374151;
    font-weight: 600;
  }
  
  &:hover {
    border-color: #d1d5db;
    transform: translateY(-1px);
  }
`

export const Label = styled.label`
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`

export const ErrorText = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  animation: ${fadeIn} 0.3s ease-out;
`

// Progress Indicator
export const ProgressIndicator = styled.div`
  width: 200px;
  height: 6px;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 1rem;
  
  div {
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transition: width 0.3s ease;
    border-radius: 3px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      animation: ${shimmer} 1.5s infinite;
    }
  }
`

// Password Link
export const PasswordLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 20px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
    border-color: rgba(102, 126, 234, 0.3);
    transform: translateY(-2px);
  }
  
  a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    
    &:hover {
      color: #764ba2;
      transform: scale(1.05);
    }
    
    span {
      font-size: 1.3rem;
    }
  }
`

// Buttons
export const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 2px solid rgba(102, 126, 234, 0.1);
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`

export const SaveButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.3rem 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 18px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.3);
  }
  
  span {
    font-size: 1.2rem;
  }
`

export const CancelButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.3rem 2rem;
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 18px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #374151;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(107, 114, 128, 0.2);
  }
  
  span {
    font-size: 1.2rem;
  }
`

export const LoadingSpinner = styled.div`
  width: 22px;
  height: 22px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

// Notifications
export const NotificationContainer = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
  background: ${(props) =>
    props.type === "success"
      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
      : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"};
  color: white;
  padding: 1.2rem 1.8rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: ${slideIn} 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 400px;
  
  @media (max-width: 640px) {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
`

export const NotificationIcon = styled.div`
  font-size: 1.5rem;
  animation: ${bounce} 1s ease-in-out;
`

export const NotificationMessage = styled.div`
  font-weight: 600;
  font-size: 1rem;
`

export const SuccessMessage = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
  animation: ${fadeIn} 0.5s ease-out;
  z-index: 1000;
  
  @media (max-width: 640px) {
    left: 1rem;
    right: 1rem;
    transform: none;
  }
`


export {

  HeaderSection,
  CoverImage,
  Overlay,
  ProfileSection,
  ProfileCard,
  ProfileContent,
  ProfileHeader,
  AvatarContainer,
  Avatar,
  AvatarImage,
  ProfileInfo,
  UserDetails,
  UserName,
  UserEmail,
  RoleBadge,
  EditButton,
  SectionCard,
  SectionContent,
  SectionDescription,
  AboutText,
  DetailsGrid,
  DetailItem,
  DetailIcon,
  DetailContent,
  DetailLabel,
  DetailValue,
  StatsGrid,
  StatCard,
  StatContent,
  StatInfo,
  StatLabel,
  StatValue,
  StatIcon,
  StatBar,
  LastCard,
};
