import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

// Components
import { LogoAndButton } from "../../components/LogoAndButton";
import { NavBar } from "../../layout/navBar";
import { ModalTeacher } from "../../components/modalTeacher";
import { Containers } from "../../components/Container";
import { H2, H3, Pargrahph } from "../../components/typography";
import AnimatedList from "../../components/Animations/AnimatedList";
import ReviewListSection from "../../components/ReviewListSection";
import CommentForm from "../../components/CommentForm";
import { StarRating } from "../../components/Star/starRating";
import { TeacherCard } from "../../components/card/teacherCard";
import Button from "@mui/material/Button";
import { LoginAndRegisterButton } from "../../components/loginButtonAndRegister";

// Style
import {
  CourseImage,
  StyledCourseWrapper,
  DetailsWrapper,
  LeftWrapper,
  RightWrapper,
  Container,
  ReviewSection,
  ProgressRow,
  MetaInfo,
  StartButtonWrapper,
  SectionTitle,
} from "./style";

import { API_URL } from "../../config";
import Loading from "../../components/Loading";
import { StyledBuyButtonAndPriceBadge } from "../../components/buyButtonAndPriceBadge/style";
import { CurrentPrice } from "../../components/card/style";
import { CourseIcon } from "../../components/Icon/courseIcon";

const CourseOne = () => {
  const [thisCourse, setThisCourse] = useState({});
  const [lessons, setLessons] = useState([]);
  const [enrollmentCourses, setEnrollmentCourses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?._id;

  const { name, id: courseId } = useParams();
  const navigate = useNavigate();

  const isEnrolled = enrollmentCourses.some(
    (enrolled) => enrolled?.course._id === courseId
  );

  useEffect(() => {
    // if (!userId) return;

    const getCourse = async () => {
      try {
        setDataLoading(true);

        // Get course data
        const res = await axios.get(`${API_URL}/courses/${courseId}`, {
          withCredentials: true,
        });
        if (res) {
          setThisCourse(res.data.data.doc);
        }

        // Get lessons
        const lessonsRes = await axios.get(
          `${API_URL}/lessons?course=${courseId}`,
          {
            withCredentials: true,
          }
        );
        if (lessonsRes) {
          setLessons(lessonsRes.data.data.docs.reverse());
        }

        // Get enrollments
        const enrollmentsRes = await axios.get(
          `${API_URL}/enrollments?user=${userId}`,
          {
            withCredentials: true,
          }
        );
        if (enrollmentsRes) {
          setEnrollmentCourses(enrollmentsRes.data.data.docs);
        }
      } catch (e) {
        console.error("Error fetching course or enrollment data:", e);
      } finally {
        setDataLoading(false);
      }
    };

    getCourse();
  }, [courseId, userId]);

  const handleSelect = (item, index) => {
    if (isEnrolled) {
      setSelectedIndex(index);
      navigate(`/courses/${name}/${courseId}/video/${index}`, {
        state: { items: lessons },
      });
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    reset();
  };

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);
      const course_ids = [courseId];

      const res = await axios.post(
        `${API_URL}/payment/create-checkout-session`,
        { ids: course_ids },
        {
          withCredentials: true,
        }
      );

      window.location.href = res.data.sessionUrl;
    } catch (e) {
      console.error("خطأ أثناء عملية الدفع:", e);
      alert("حدث خطأ أثناء معالجة الدفع. حاول مرة أخرى.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <LogoAndButton />
      <NavBar />
      <ModalTeacher />

      <Containers>
        <H2>تفاصيل الدورة</H2>

        <StyledCourseWrapper>
          <CourseImage src="/assets/img/learn.png" alt="صورة الدورة" />
          <DetailsWrapper>
            <ProgressRow>
              {/* <Progress /> */}
              {/* <WatchText>نسبة المشاهدة 60%</WatchText> */}
            </ProgressRow>

            <div>
              <Pargrahph>البداية مع</Pargrahph>
              <H2>{thisCourse?.name || "..."}</H2>
              <Pargrahph>
                {thisCourse?.description || "وصف الدورة غير متوفر."}
              </Pargrahph>

              <MetaInfo>
                <CourseIcon icon="clock" text="13H" />
                <CourseIcon icon="star" text={thisCourse.averageRating} />
              </MetaInfo>
            </div>

            <StartButtonWrapper>
              {isEnrolled ? (
                <Button variant="contained" color="primary" onClick={() => handleSelect(null, 0)}>
                  ابدأ الدورة الآن
                </Button>
              ) : (
                <StyledBuyButtonAndPriceBadge>
                  <LoginAndRegisterButton
                    fontSize={18}
                    onClick={handlePayment}
                    isDisabled={paymentLoading}
                  >
                    {paymentLoading ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span className="spinner" /> جاري المعالجة...
                      </span>
                    ) : (
                      "شراء "
                    )}
                  </LoginAndRegisterButton>
                  <CurrentPrice>
                    {thisCourse?.price === 0 ? (
                      <>مجاني</>
                    ) : (
                      <>{thisCourse?.price} ₪ </>
                    )}
                  </CurrentPrice>
                </StyledBuyButtonAndPriceBadge>
              )}
            </StartButtonWrapper>
          </DetailsWrapper>
        </StyledCourseWrapper>

        <H2>الدروس</H2>
        <Container>
          <LeftWrapper>
            <AnimatedList
              items={lessons}
              selectedIndex={selectedIndex}
              onItemSelect={handleSelect}
            />
          </LeftWrapper>

          <RightWrapper>
            <TeacherCard
              id={thisCourse.teacher?._id}
              name={thisCourse.teacher?.name || "معلم غير معروف"}
              desc={thisCourse.teacher?.description}
              imgSrc={thisCourse.teacher?.coverImage}
              starIcon={thisCourse.averageRating || 0}
              badge="معلم"
            />
          </RightWrapper>
        </Container>

        <SectionTitle>مراجعات الطلاب</SectionTitle>
        <ReviewSection>
          <ReviewListSection
            courseId={courseId}
            userId={userId}
            from={"coursePage"}
          />

          {isEnrolled && (
            <>
              <H3>أضف تقييمك</H3>
              <StarRating />

              <CommentForm
                courseId={courseId}
                from={"coursePage"}
                register={register}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                errors={errors}
              />
            </>
          )}
        </ReviewSection>
      </Containers>
    </>
  );
};

export default CourseOne;
