//react
import { useNavigate } from "react-router-dom";

//style
import { AnimationWrapper, Info } from "./style";

//component
import { H1, Pargrahph } from "../typography";
import { Button } from "../Buttons/button";

//Animations
import { DiscoverCourses } from "../Animations/discover";

//Paths
import { PATH } from "../../routes";

export const DiscoverSection = () => {
  const navigate = useNavigate();
  return (
    <AnimationWrapper>
      <DiscoverCourses />

      <Info>
        <H1>
          تعلّم كل موضوع في الوقت المحدد في كل مرة
        </H1>
        <Pargrahph>
          يُعد تعلّم الدورات عبر الإنترنت وسيلة فعالة لتطوير المهارات واكتساب
          المعرفة في مختلف المجالات. يتميز هذا النوع من التعليم بالمرونة، حيث
          يمكن للمتعلمين الدراسة في أي وقت ومن أي مكان، مما يجعله مناسبًا
          للجميع، سواء طلابًا أو موظفين. توفر المنصات التعليمية محتوى متنوعًا
          وحديثًا في مجالات مثل البرمجة، التصميم، التسويق، واللغات. كما أن
          الشهادات التي تقدمها تعزز فرص الحصول على وظائف أو تحسين المسار المهني.
          يساعد التعلّم عبر الإنترنت الأفراد على مواكبة التطورات المستمرة
          ويشجّعهم على الاستمرار في التعلّم مدى الحياة، مما يساهم في بناء مجتمع
          معرفي متقدم.
        </Pargrahph>
        <Button onClick={() => navigate(`/${PATH.Courses}`)}>
          اكتشف الدورات
        </Button>
      </Info>
    </AnimationWrapper>
  );
};
