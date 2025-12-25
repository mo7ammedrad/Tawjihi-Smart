//react
import { Outlet, useLocation } from "react-router-dom";

// styled
import { StyledNavLink, UlWrapper, Wrapper } from "./style";

// components
import { LogoAndButton } from "../../components/LogoAndButton";
import { RegisterAnimation } from "../../components/Animations/RegisterAnimatiom";
import { Containers } from "../../components/Container";

// Paths
import { PATH } from "../../routes";

const Auth = () => {
  const location = useLocation();

  return (
    <>
      <LogoAndButton />

      <UlWrapper>
        <li>
          <StyledNavLink
            to={`/${PATH.Register}`}
            $active={location.pathname === `/${PATH.Register}`}
            className={
              location.pathname === `/${PATH.Register}` ? "active" : ""
            }
          >
            التسجيل
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            to={`/${PATH.Login}`}
            $active={location.pathname === `/${PATH.Login}`}
            className={location.pathname === `/${PATH.Login}` ? "active" : ""}
          >
            تسجيل الدخول
          </StyledNavLink>
        </li>
      </UlWrapper>

      <Containers>
        <Wrapper>
          <Outlet />
          <RegisterAnimation />
        </Wrapper>
      </Containers>
    </>
  );
};

export default Auth;
