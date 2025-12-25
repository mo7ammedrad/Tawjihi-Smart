//react
import { Link } from "react-router-dom";
// style
import {
  Bottom,
  Container,
  FooterWrapper,
  List,
  ListItem,
  Logoo,
  Section,
  Title,
} from "./style";

//components
import { Logo } from "../../components/logo";
import { PATH } from "../../routes";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const Footer = () => {

  const { theme } = useContext(ThemeContext);

  return (
    <FooterWrapper>
      <Container>
        <Section>
          <Logoo>
            <Logo />
          </Logoo>
          <List>
            <ListItem style={{ fontSize: "15px" }}>
              منصة توجيهي طريقك نحو العلامة الكاملة
            </ListItem>

        
            <ListItem
              style={{
                color: "white",
                fontSize: "15px",
              }}
            >
              متابعة دروسك مع مدربين ذو كفاءة واحترافية عالية
            </ListItem>
          </List>
        </Section>

        <Section>
          <Title>الدورات</Title>
          <List>
            <ListItem>
              <Link to=""> اللغة العربية</Link>
            </ListItem>
            <ListItem>
              <Link to=""> اللغة الانجليزية</Link>
            </ListItem>
            <ListItem>
              <Link to="">الرياضيات</Link>
            </ListItem>
            <ListItem>
              <Link to=""> الفيزياء</Link>
            </ListItem>
          </List>
        </Section>

        <Section>
          <Title>عن المنصة</Title>
          <List>
            <ListItem>
              <Link to={`/${PATH.About}`}>من نحن</Link>{" "}
            </ListItem>
            <ListItem>
              <Link to={`/${PATH.Teachers}`}>المعلمين</Link>
            </ListItem>
            <ListItem>
              <Link to={`/${PATH.News}`}>اخر الاخبار </Link>
            </ListItem>
            <ListItem>
              <Link to={`/${PATH.Contact}`}>تواصل معنا</Link>
            </ListItem>
          </List>
        </Section>

        <Section>
          <Title>تواصل معنا</Title>
          <p>البريد: mo7ammedrad@gmail.com</p>
          <p>الهاتف: +970597128272</p>
          <p>البريد: jamaldegham@gmail.com</p>
          <p>الهاتف: +970597593345</p>
        </Section>
      </Container>

      <Bottom>
        {new Date().getFullYear()} &copy; جميع الحقوق محفوظة -منصة توجيهي
        اونلاين
      </Bottom>
    </FooterWrapper>
  );
};

export default Footer;
