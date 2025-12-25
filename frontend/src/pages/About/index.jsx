//layout Components
import { NavBar } from "../../layout/navBar";
import Footer from "../../layout/footer";

//Components
import { LogoAndButton } from "../../components/LogoAndButton";
import { ModalTeacher } from "../../components/modalTeacher";
import { Containers } from "../../components/Container";

const About = () => {
  return (
    <div>
      <ModalTeacher isOpen="true" />

      <LogoAndButton />
      <NavBar />
      <Containers>
        <h1>من أنا</h1>
        <p>
          توجيهي هي منصة تعليم إلكتروني تساعد الطلاب على التعلم بشكل أفضل من خلال دورات منظمة ودروس واضحة ولوحة تحكم
          حديثة للمعلمين والإدارة.
        </p>
        <h2>ماذا يمكنك أن تفعل هنا؟</h2>
        <ul>
          <li>الطلاب: تصفح الدورات، التسجيل، مشاهدة الدروس، ومتابعة التقدم.</li>
          <li>المعلمون: إنشاء الدورات/الدروس والتواصل مع الطلاب.</li>
          <li>الإدارة: إدارة المستخدمين والدورات والمواد/الفروع والمدفوعات والأخبار.</li>
        </ul>
      </Containers>
      <Footer />
    </div>
  );
};

export default About;
