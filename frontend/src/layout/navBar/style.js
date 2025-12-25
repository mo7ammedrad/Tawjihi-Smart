import styled from "styled-components";

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.heading};
  padding: 15px;
  position: relative;
  flex-wrap: wrap;
  gap: 12px;

  .navBarItems {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    list-style: none;
    transition: all 0.3s ease-in-out;
  }

  .navIcons {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }

  .icon-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #eef1f4;
    color: #1f2d3d;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .icon-link:hover {
    background: #e0e7ff;
    color: #0d6efd;
  }

  .material-icon {
    font-family: 'Material Icons', 'Material Symbols Outlined', sans-serif;
    font-size: 20px;
    line-height: 1;
  }

  .badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #e60023;
    color: #fff;
    border-radius: 999px;
    padding: 2px 6px;
    font-size: 10px;
  }

  .navBarItems li a {
    color: var(--color-dark-text);
    text-decoration: none;
    font-size: 16px;
    transition: color 0.2s ease-in-out;
  }

  .navBarItems li a:hover {
    background: ${(props) => props.theme.linearGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  @media (max-width: 767px) {
    .navBarItems {
      display: none;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      padding: 10px 0;
    }

    .navBarItems.open {
      display: flex;
    }

    .navBarItems li {
      margin: 10px 0;
    }
  }

  .active {
    color: var(--color-primary);
    font-weight: bold;
    border-bottom: 2px solid var(--color-primary);
  }
`;
