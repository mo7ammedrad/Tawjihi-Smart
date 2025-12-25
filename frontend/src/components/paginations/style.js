import styled from "styled-components"

// Wrapper for pagination container (centers horizontally)
export const PaginationWrapper = styled.div`
  display: block;
  margin: auto;
`

// Container for pagination buttons with responsive gap
export const PaginationContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 20px 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 6px;
  }

  @media (max-width: 480px) {
    gap: 4px;
  }
`

// Pagination button styles
export const PaginationButton = styled.button`
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.checkBorder};
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    transform: none;
  }

  // Hover style applies only when not disabled and not active
  &:hover:not(:disabled) {
    background-color: #f0f0f0;
    opacity: 0.5;
  }

  // Active button styles, controlled by $active prop
  ${({ $active, theme }) =>
    $active &&
    `
      background-color: ${theme.checkBorder};
      color: #f0f0f0;
      border-color: ${theme.checkBorder};
      cursor: default;
      pointer-events: none;
  `}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    min-width: 32px;
    height: 32px;
    padding: 0 10px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    min-width: 28px;
    height: 28px;
    padding: 0 8px;
    font-size: 12px;
  }
`
