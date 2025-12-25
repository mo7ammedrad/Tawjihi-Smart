import styled, { keyframes } from "styled-components"

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

export const SidebarContainer = styled.aside`
  /* Desktop Styles */
  width: 300px;
  min-height: 100vh;
  max-height: 100vh;
  background: ${props => props.theme.background};
  border-left: 1px solid #e5e7eb;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  border: 1px solid ${props => props.theme.border};


  /* Tablet Portrait */
  @media (max-width: 768px) {
    width: 85vw;
    max-width: 400px;
    min-width: 280px;
    height: 100vh;
    max-height: 100vh;
    position: fixed;
    top: 0;
    right: ${(props) => (props.isOpen ? "0" : "-100%")};
    z-index: 10000;
    animation: ${(props) => (props.isOpen ? slideInRight : "none")} 0.3s ease-out;
    box-shadow: ${(props) => (props.isOpen ? "-10px 0 30px rgba(0, 0, 0, 0.15)" : "none")};
    border-radius: ${(props) => (props.isOpen ? "20px 0 0 20px" : "0")};
    border-left: none;
  }



  /* Small Mobile */
  @media (max-width: 360px) {
    width: 95vw;
    max-width: 280px;
    min-width: 240px;
  }

`

export const SidebarContent = styled.div`
  padding: 0;
  height: 100%;
  max-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
  
  /* Custom scrollbar for webkit browsers */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f8fafc;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
    
    &:hover {
      background: #94a3b8;
    }
  }

  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f8fafc;

  /* Mobile scrollbar adjustments */
  @media (max-width: 768px) {
    &::-webkit-scrollbar {
      width: 2px;
    }
  }
`

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem 1.5rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex-shrink: 0;
  min-height: fit-content;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.2;
    word-break: break-word;
  }

  /* Large Desktop */
  @media (min-width: 1440px) {
    padding: 2.5rem 2rem 1.5rem;
    
    h2 {
      font-size: 1.75rem;
    }
  }

  /* Tablet */
  @media (max-width: 768px) {
    padding: 1.5rem 1rem 1rem;
    gap: 0.75rem;
    
    h2 {
      font-size: 1.25rem;
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    padding: 1.25rem 0.75rem 0.75rem;
    gap: 0.5rem;
    
    h2 {
      font-size: 1.1rem;
    }
  }

  /* Small Mobile */
  @media (max-width: 360px) {
    padding: 1rem 0.5rem 0.5rem;
    
    h2 {
      font-size: 1rem;
    }
  }
`

export const FilterIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  
  svg {
    font-size: 1.5rem;
    color: white;
  }

  /* Tablet */
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    
    svg {
      font-size: 1.25rem;
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    
    svg {
      font-size: 1.1rem;
    }
  }

  /* Small Mobile */
  @media (max-width: 360px) {
    width: 32px;
    height: 32px;
    
    svg {
      font-size: 1rem;
    }
  }
`

export const HeaderBadge = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  margin-top: 0.25rem;
  line-height: 1.2;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }

  /* Small Mobile */
  @media (max-width: 360px) {
    font-size: 0.65rem;
  }
`

export const FilterCard = styled.div`
  margin: 1rem 1.5rem;
  background: ${props => props.theme.background};
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;
  flex-shrink: 0;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  /* Large Desktop */
  @media (min-width: 1440px) {
    margin: 1.25rem 2rem;
    border-radius: 18px;
  }

  /* Tablet */
  @media (max-width: 768px) {
    margin: 1rem;
    border-radius: 14px;
  }

  /* Mobile */
  @media (max-width: 480px) {
    margin: 0.75rem;
    border-radius: 12px;
  }

  /* Small Mobile */
  @media (max-width: 360px) {
    margin: 0.5rem;
    border-radius: 10px;
  }
`

export const FilterTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: ${props => props.theme.background};
  border-bottom: 1px solid #e5e7eb;
  
  .title-text {
    font-size: 1rem;
    font-weight: 600;
    color: ${props => props.theme.color};
    line-height: 1.2;
    word-break: break-word;
    flex: 1;
    margin-right: 0.5rem;
  }
  
  .title-count {
    background: #667eea;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    min-width: 24px;
    text-align: center;
    flex-shrink: 0;
  }

  /* Large Desktop */
  @media (min-width: 1440px) {
    padding: 1.5rem 2rem;
    
    .title-text {
      font-size: 1.1rem;
    }
    
    .title-count {
      font-size: 0.8rem;
      padding: 0.3rem 0.8rem;
    }
  }

  /* Tablet */
  @media (max-width: 768px) {
    padding: 1rem 1.25rem;
    
    .title-text {
      font-size: 0.95rem;
    }
    
    .title-count {
      font-size: 0.7rem;
      padding: 0.2rem 0.6rem;
      border-radius: 10px;
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    padding: 0.875rem 1rem;
    
    .title-text {
      font-size: 0.9rem;
    }
    
    .title-count {
      font-size: 0.65rem;
      padding: 0.15rem 0.5rem;
      border-radius: 8px;
      min-width: 20px;
    }
  }

  /* Small Mobile */
  @media (max-width: 360px) {
    padding: 0.75rem 0.75rem;
    
    .title-text {
      font-size: 0.85rem;
    }
    
    .title-count {
      font-size: 0.6rem;
      padding: 0.1rem 0.4rem;
      min-width: 18px;
    }
  }
`

export const CheckSection = styled.div`
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f8fafc;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
  }

  /* Large Desktop */
  @media (min-width: 1440px) {
    padding: 1.25rem 2rem;
    gap: 0.6rem;
    max-height: 350px;
  }

  /* Tablet */
  @media (max-width: 768px) {
    padding: 0.875rem 1.25rem;
    gap: 0.4rem;
    max-height: 250px;
  }

  /* Mobile */
  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    gap: 0.3rem;
    max-height: 200px;
  }

  /* Small Mobile */
  @media (max-width: 360px) {
    padding: 0.625rem 0.75rem;
    gap: 0.25rem;
    max-height: 180px;
  }
`

export const LoadingText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #6b7280;
  font-size: 0.9rem;
  padding: 2rem 1.5rem;
  
  .loading-dots {
    display: flex;
    gap: 0.25rem;
    
    span {
      width: 8px;
      height: 8px;
      background: #667eea;
      border-radius: 50%;
      animation: ${bounce} 1.4s ease-in-out infinite both;
      
      &:nth-child(1) { animation-delay: -0.32s; }
      &:nth-child(2) { animation-delay: -0.16s; }
      &:nth-child(3) { animation-delay: 0s; }
    }
  }

  /* Tablet */
  @media (max-width: 768px) {
    padding: 1.5rem 1.25rem;
    font-size: 0.85rem;
    gap: 0.75rem;
    
    .loading-dots span {
      width: 6px;
      height: 6px;
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    padding: 1.25rem 1rem;
    font-size: 0.8rem;
    gap: 0.5rem;
    
    .loading-dots span {
      width: 5px;
      height: 5px;
    }
  }
`

export const ToggleButtonWrapper = styled.div`
  top: 2rem;
  right: 2rem;
  z-index: 10001;
  display: none;
  opacity: ${(props) => (props.isOpen ? 0 : 1)};
  visibility: ${(props) => (props.isOpen ? "hidden" : "visible")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    display: block;
  }

`

export const ToggleButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${pulse} 2s infinite;
  position: absolute;
  top: 167px;
  right: 10px;
  

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    font-size: 1.5rem;
  }

  /* Mobile */
  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    
    svg {
      font-size: 1.25rem;
    }
  }

  /* Small Mobile */
  @media (max-width: 360px) {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    
    svg {
      font-size: 1.1rem;
    }
  }
`

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease-out;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`

export const SidebarFooter = styled.div`
  margin-top: auto;
  padding: 1.5rem;
  border-top: 1px solid #f1f5f9;
  background: ${props => props.theme.background};
  flex-shrink: 0;
  
  p {
    margin: 0;
    font-size: 0.8rem;
    color: #6b7280;
    text-align: center;
    line-height: 1.4;
    word-break: break-word;
  }

  /* Large Desktop */
  @media (min-width: 1440px) {
    padding: 2rem;
    
    p {
      font-size: 0.85rem;
    }
  }

  /* Tablet */
  @media (max-width: 768px) {
    padding: 1.25rem 1rem;
    
    p {
      font-size: 0.75rem;
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
    
    p {
      font-size: 0.7rem;
    }
  }

  /* Small Mobile */
  @media (max-width: 360px) {
    padding: 0.75rem 0.5rem;
    
    p {
      font-size: 0.65rem;
    }
  }
`

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`

export const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    font-size: 1.25rem;
  }

  /* Show only on mobile */
  @media (min-width: 769px) {
    display: none;
  }

  /* Mobile */
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    
    svg {
      font-size: 1.1rem;
    }
  }

  /* Small Mobile */
  @media (max-width: 360px) {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    
    svg {
      font-size: 1rem;
    }
  }
`
