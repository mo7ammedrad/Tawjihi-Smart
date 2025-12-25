"use client"

import { useEffect, useState, useContext, useMemo } from "react"
import { Link } from "react-router-dom"

// style
import {
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  FilterTabs,
  FilterTab,
  SectionWrapper,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  CardsGrid,
  LoadingGrid,
  EmptyState,
  ViewMoreSection,
  ViewMoreButton,
  StatsSection,
  StatItem,
  StatNumber,
  StatLabel,
} from "./style"

// layouts Components
import { NavBar } from "../../layout/navBar"
import Footer from "../../layout/footer"

// components
import { Containers } from "../../components/Container"
import SearchBar from "../../components/search"
import { LineColor } from "../../components/lineColor"
import { DiscoverSection } from "../../components/discoverSection"
import { CourseCard } from "../../components/card/courseCard"
import { ModalTeacher } from "../../components/modalTeacher"
import { LogoAndButton } from "../../components/LogoAndButton"
import { CardSkeleton } from "../../components/Loading/LoadingCard"
import { SkeletonTeacherCard } from "../../components/Loading/SkeletonTeacherCard"
import { TeacherCard } from "../../components/card/teacherCard"

// hooks
import { useApi } from "../../hooks/useApi"

// URL
import { API_URL } from "../../config"

// context
import { LogOutContext } from "../../context/LogoutContext"

//Path
import { PATH } from "../../routes"

//toast
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const MainPage = () => {
  const { isLogout, setIsLogout } = useContext(LogOutContext)
  const [active, setActive] = useState(1) // 0: Free, 1: Newest, 2: Discounted

  const menuItems = [
    { label: "الدورات المجانية", icon: "🆓" },
    { label: "احدث الدورات", icon: "🆕" },
    { label: "دورات الخصم", icon: "💰" },
  ]

  const { data: dataCourses, isLoading } = useApi(`${API_URL}/courses/`)
  const { data: dataTeachers } = useApi(`${API_URL}/users/?role=teacher&isActive=true&limit=3`)

  //filteredCourses
  const filteredCourses = useMemo(() => {
    return dataCourses.filter((course) => {
      if (active === 0) return course.price === 0
      if (active === 1) return true
      if (active === 2) return course.priceAfterDiscount !== undefined
      return true
    })
  }, [dataCourses, active])

  useEffect(() => {
    if (isLogout) {
      setIsLogout(false) // إعادة الحالة الافتراضية بعد التحديث
    }
  }, [isLogout, setIsLogout])

  return (
    <>
      <ToastContainer />
      <ModalTeacher isOpen="true" />
      <LogoAndButton />
      <NavBar />

      <HeroSection>
        <Containers>
          <HeroContent>
            <HeroTitle>تعلم الدورات عبر الانترنت</HeroTitle>
            <HeroSubtitle>تعلّم كل موضوع في الوقت المحدد في كل مرة</HeroSubtitle>
            <SearchBar />

            <StatsSection>
              <StatItem>
                <StatNumber>3250+</StatNumber>
                <StatLabel>معلم محترف</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>500+</StatNumber>
                <StatLabel>دورة تدريبية</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>10000+</StatNumber>
                <StatLabel>طالب نشط</StatLabel>
              </StatItem>
            </StatsSection>
          </HeroContent>
        </Containers>
      </HeroSection>

      <SectionWrapper>
        <Containers>
          <SectionHeader>
            <SectionTitle>استكشف الدورات</SectionTitle>
            <SectionSubtitle>اختر من مجموعة متنوعة من الدورات التعليمية</SectionSubtitle>
          </SectionHeader>

          <FilterTabs>
            {menuItems.map((item, index) => (
              <FilterTab key={index} className={active === index ? "active" : ""} onClick={() => setActive(index)}>
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </FilterTab>
            ))}
          </FilterTabs>

          <LineColor />

          <CardsGrid>
            {isLoading ? (
              <LoadingGrid>
                {Array.from({ length: 3 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </LoadingGrid>
            ) : filteredCourses.length === 0 ? (
              <EmptyState>
                <div className="icon">📚</div>
                <h3>لا توجد دورات مطابقة</h3>
                <p>جرب تغيير الفلتر أو ابحث عن دورات أخرى</p>
              </EmptyState>
            ) : (
              <>
                {filteredCourses.slice(0, 3).map((item, index) => (
                  <CourseCard
                    key={item._id}
                    item={item}
                    id={item._id}
                    imgSrc={item.coverImg || "/assets/img/logo.png"}
                    name={item.name}
                    starIcon={item.averageRating}
                    price={item.price}
                    priceAfterDiscount={item.priceAfterDiscount}
                    teacherName={item.teacher?.name}
                    teacherImg={item.teacher?.img || "/assets/img/logo.png"}
                    branch={item.branches.map((b) => b.name).join(" | ")}
                    subject={item.subject?.name}
                  />
                ))}
              </>
            )}
          </CardsGrid>

          {!isLoading && filteredCourses.length > 0 && (
            <ViewMoreSection>
              <ViewMoreButton>
                <Link to={`/${PATH.Courses}`}>
                  <span>عرض جميع الدورات</span>
                  <span className="arrow">←</span>
                </Link>
              </ViewMoreButton>
            </ViewMoreSection>
          )}
        </Containers>
      </SectionWrapper>

      <DiscoverSection />

      <SectionWrapper>
        <Containers>
          <SectionHeader>
            <SectionTitle>تعرف على معلمينا</SectionTitle>
            <SectionSubtitle>لدينا أكثر من 3250 مدربًا محترفًا وماهراً</SectionSubtitle>
          </SectionHeader>

          <LineColor />

          <CardsGrid>
            {isLoading ? (
              <LoadingGrid>
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonTeacherCard key={i} />
                ))}
              </LoadingGrid>
            ) : dataTeachers.length === 0 ? (
              <EmptyState>
                <div className="icon">👨‍🏫</div>
                <h3>لا يوجد معلمين متاحين</h3>
                <p>اتصال انترنت ضعيف يتم التحميل ...</p>
              </EmptyState>
            ) : (
              <>
                {dataTeachers.slice(0, 3).map((item, index) => (
                  <TeacherCard
                    id={item._id}
                    name={item.name}
                    desc={item.description || "لا يوجد وصف متاح"}
                    imgSrc={item.coverImage || "/assets/img/logo.png"}
                    key={index}
                    starIcon={4.5}
                    badge="معلم"
                  />
                ))}
              </>
            )}
          </CardsGrid>

          {!isLoading && dataTeachers.length > 0 && (
            <ViewMoreSection>
              <ViewMoreButton>
                <Link to={`/${PATH.Teachers}`}>
                  <span>عرض جميع المعلمين</span>
                  <span className="arrow">←</span>
                </Link>
              </ViewMoreButton>
            </ViewMoreSection>
          )}
        </Containers>
      </SectionWrapper>

      <Footer />
    </>
  )
}

export default MainPage
