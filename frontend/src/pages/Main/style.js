import styled from "styled-components"

export const HeroSection = styled.section`
  background: ${( props ) => props.theme.linearGradient};
  color: white;
  padding: 80px 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
      repeat;
    opacity: 0.3;
  }

  @media (max-width: 768px) {
    padding: 60px 0;
  }
`

export const HeroContent = styled.div`
  text-align: center;
  position: relative;
  z-index: 1;
`

export const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 16px 0;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`

export const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin: 0 0 40px 0;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 32px;
  }
`

export const StatsSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-top: 48px;

  @media (max-width: 768px) {
    gap: 24px;
    margin-top: 32px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 16px;
  }
`

export const StatItem = styled.div`
  text-align: center;
`

export const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`

export const SectionWrapper = styled.section`
  padding: 80px 0;
  background: ${({ theme }) => theme.background || "#ffffff"};

  @media (max-width: 768px) {
    padding: 60px 0;
  }
`

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    margin-bottom: 32px;
  }
`

export const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.color || "#2c3e50"};
  margin: 0 0 16px 0;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

export const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.color || "#6c757d"};
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 40px 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 12px;
    margin: 32px 0;
  }
`

export const FilterTab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border: 2px solid ${({ theme }) => theme.border || "#e1e8ed"};
  background: ${({ theme }) => theme.background || "white"};
  color: ${({ theme }) => theme.color || "#6c757d"};
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 500;

  .icon {
    font-size: 18px;
  }

  .label {
    white-space: nowrap;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }


  &.active {

  border: 2px solid ${({ theme }) => theme.background };
  border-radius: 25px;
  padding: 12px 24px; 

  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* background */

  color: white;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}



    @media (max-width: 768px) {
      padding: 10px 20px;
      font-size: 14px;

      .icon {
        font-size: 16px;
      }
    }
  `

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin: 40px 0;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin: 32px 0;
  }
`

export const LoadingGrid = styled.div`
  display: contents;
`

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  background: ${({ theme }) => theme.background_secondary || "#f8f9fa"};
  border-radius: 16px;
  border: 2px dashed ${({ theme }) => theme.border || "#e1e8ed"};

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 24px;
    font-weight: 600;
    color: ${({ theme }) => theme.color || "#2c3e50"};
    margin: 0 0 8px 0;
  }

  p {
    font-size: 16px;
    color: ${({ theme }) => theme.color || "#6c757d"};
    margin: 0;
  }
`

export const ViewMoreSection = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;

  @media (max-width: 768px) {
    margin-top: 32px;
  }
`

export const ViewMoreButton = styled.div`
  a {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);

    .arrow {
      transition: transform 0.3s ease;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);

      .arrow {
        transform: translateX(-4px);
      }
    }
  }

  @media (max-width: 768px) {
    a {
      padding: 12px 24px;
      font-size: 14px;
    }
  }
`

// Legacy exports for backward compatibility with existing style.js
export const ImgLogo = styled.img`
  width: 10rem;
`

export const Wrappers = styled.div`
  background-color: ${({ theme }) => theme.primary};
  color: #fff;
  text-align: center;
  padding: 12px 0;
`

export const WrapperUl = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  margin: 40px 0px;
  padding: 0;

  li {
    margin: 0px 50px;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: var(--color-primary);
    }
  }

  .active {
    color: var(--color-primary);
  }
`

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

export const WrapperCards = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  gap: 0px 15px;
`
