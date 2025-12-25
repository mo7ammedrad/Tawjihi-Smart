//style
import StyledHamburger from "./style";

const Hamburger = ({ isOpen, toggleMenu }) => {
  return (
    <StyledHamburger onClick={toggleMenu} $isOpen={isOpen}>
      <div />
      <div />
      <div />
    </StyledHamburger>
  );
};

export default Hamburger;
