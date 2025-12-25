// react
import { Link } from "react-router-dom";
//style
import { ImgLogo } from "./style";

//Path
import { PATH } from "../../routes";

export const Logo = () => {
  return (
    <>
      <Link to={PATH.Main}>
        <ImgLogo src="/assets/img/learning.png" alt="Logo" />
      </Link>
    </>
  );
};
