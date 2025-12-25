import { NotFoundContainer, Title, Description, BackButton } from "./style";
import { PATH } from "../../routes";

const NotAuth = () => {
  return (
    <NotFoundContainer>
      <Title>غير مصرح لك بدخول الصفحة</Title>
      <Description>يرجى تسجيل الدخول للوصول إلى هذه الصفحة.</Description>
      <BackButton to={`/${PATH.Login}`}>العودة إلى صفحة تسجيل الدخول</BackButton>
    </NotFoundContainer>
  );
};

export default NotAuth;
