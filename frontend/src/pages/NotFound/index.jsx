//styled
import { NotFoundContainer, Title, Description, BackButton } from "./style";

const NotFound = () => {
  return (
    <NotFoundContainer>
      <Title>404 - الصفحة غير موجودة</Title>
      <Description>
        عذرًا، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </Description>
      <BackButton to="/">العودة إلى الصفحة الرئيسية</BackButton>
    </NotFoundContainer>
  );
};

export default NotFound;
