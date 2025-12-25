"use client";

import { useParams } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../../config";
import { useProfileApi } from "../../hooks/useProfileApi";
import { LogoAndButton } from "../../components/LogoAndButton";
import { NavBar } from "../../layout/navBar";
import { Containers } from "../../components/Container";
import { useApi } from "../../hooks/useApi";
import { CourseCard } from "../../components/card/courseCard";
import { CardSkeleton } from "../../components/Loading/LoadingCard";
import { Typography } from "@mui/material";
import Paginations from "../../components/paginations";
import FilterMenuItem from "../../components/MenuItem/FilterMenuItem";
import { paginate } from "../../utils/pagination";
import {
  AboutText,
  ContactCard,
  ContactGrid,
  ContactIcon,
  ContactText,
  ContentWrapper,
  CourseCardWrapper,
  CoursesGrid,
  CoursesSection,
  Divider,
  EmptyIcon,
  EmptyState,
  EmptyText,
  ErrorState,
  FilterSection,
  HeroSection,
  LoadingGrid,
  ModernDownloadButton,
  OnlineIndicator,
  PaginationWrapper,
  ProfileHeader,
  ProfileHeroCard,
  ProfileImage,
  ProfileImageContainer,
  ProfileInfo,
  SectionCard,
  SectionContainer,
  SectionContent,
  SectionHeader,
  SectionIcon,
  SectionTitle,
  StatCard,
  StatLabel,
  StatNumber,
  StatsContainer,
  TeacherName,
  TeacherProfileWrapper,
} from "./style";

function TeacherProfile() {
  const { id } = useParams();
  const { data, isLoading, error } = useProfileApi(`${API_URL}/users/${id}`);
  const profileData = data.doc;

  const { data: fetchedCourses = [] } = useApi(`${API_URL}/courses/`);

  console.log("Fetched Courses:", fetchedCourses);
  console.log("Teacher ID:", id);
  const teacherCourses = fetchedCourses.filter(
    (course) => course?.teacher?._id === id
  );
console.log("Teacher Courses:", teacherCourses);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { currentItems, totalPages } = paginate(
    teacherCourses,
    currentPage,
    itemsPerPage
  );

  return (
    <TeacherProfileWrapper>
      <ContentWrapper>
        <LogoAndButton />
        <NavBar />

        {/* Hero Section */}
        <HeroSection className="img-sec">
          <Containers>
            <ProfileHeroCard>
              <ProfileHeader>
                <ProfileImageContainer>
                  <ProfileImage
                    src={profileData?.coverImage}
                    alt={`صورة ${profileData?.name}`}
                  />
                  <OnlineIndicator />
                </ProfileImageContainer>

                <ProfileInfo>
                  <TeacherName>{profileData?.name}</TeacherName>

                  <ContactGrid>
                    <ContactCard>
                      <ContactIcon>✉️</ContactIcon>
                      <ContactText>{profileData?.email}</ContactText>
                    </ContactCard>
                    <ContactCard>
                      <ContactIcon>📱</ContactIcon>
                      <ContactText>{profileData?.phone}</ContactText>
                    </ContactCard>
                  </ContactGrid>

                  <StatsContainer>
                    <StatCard>
                      <StatNumber>{teacherCourses.length}</StatNumber>
                      <StatLabel>الدورات</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatNumber>4.8</StatNumber>
                      <StatLabel>التقييم</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatNumber>1,250</StatNumber>
                      <StatLabel>الطلاب</StatLabel>
                    </StatCard>
                  </StatsContainer>
                </ProfileInfo>
              </ProfileHeader>
            </ProfileHeroCard>
          </Containers>
        </HeroSection>

        <Divider />

        {/* About Section */}
        <SectionContainer>
          <Containers>
            <SectionCard>
              <SectionHeader>
                <SectionTitle>
                  <SectionIcon>👨‍🏫</SectionIcon>
                  نبذة عن المدرس
                </SectionTitle>
              </SectionHeader>
              <SectionContent className="about-sec">
                <AboutText>
                  {profileData?.description || "لا توجد نبذة متاحة حاليًا."}
                </AboutText>
                {profileData?.cv && (
                  <ModernDownloadButton
                    href={profileData.cv}
                    download={`${profileData.name}_CV.pdf`}
                  >
                    <span>📄</span>
                    عرض السيرة الذاتية
                  </ModernDownloadButton>
                )}
              </SectionContent>
            </SectionCard>
          </Containers>
        </SectionContainer>

        <Divider />

        {/* Courses Section */}
        <SectionContainer>
          <Containers>
            <SectionCard>
              <SectionHeader>
                <SectionTitle>
                  <SectionIcon>📚</SectionIcon>
                  الدورات ({teacherCourses.length})
                </SectionTitle>
              </SectionHeader>
              <SectionContent>
                <CoursesSection>
                  {teacherCourses.length ? (
                    <FilterSection>
                      <FilterMenuItem
                        currentPage={currentPage}
                        totalPages={totalPages}
                        order={false}
                      />
                    </FilterSection>
                  ) : null}

                  {isLoading ? (
                    <LoadingGrid>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="skeleton-card">
                          <CardSkeleton />
                        </div>
                      ))}
                    </LoadingGrid>
                  ) : error ? (
                    <ErrorState>
                      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
                        ❌
                      </div>
                      <Typography color="error">
                        فشل في تحميل الدورات
                      </Typography>
                    </ErrorState>
                  ) : teacherCourses.length === 0 ? (
                    <EmptyState>
                      <EmptyIcon>📚</EmptyIcon>
                      <EmptyText>لا توجد دورات متاحة حاليًا.</EmptyText>
                    </EmptyState>
                  ) : (
                    <CoursesGrid>
                      {currentItems.map((item) => (
                        <CourseCardWrapper key={item._id}>
                          <CourseCard
                            item={item}
                            id={item._id}
                            imgSrc={item.img || "/assets/img/logo.png"}
                            name={item.name}
                            starIcon={item.averageRating}
                            price={item.price}
                            priceAfterDiscount={item.priceAfterDiscount}
                            teacherName={item.teacher?.name}
                            teacherImg={
                              item.teacher?.img || "/assets/img/logo.png"
                            }
                            branch={item.branches
                              .map((b) => b.name)
                              .join(" | ")}
                            subject={item.subject?.name}
                          />
                        </CourseCardWrapper>
                      ))}
                    </CoursesGrid>
                  )}

                  {totalPages > 1 && (
                    <PaginationWrapper>
                      <Paginations
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                      />
                    </PaginationWrapper>
                  )}
                </CoursesSection>
              </SectionContent>
            </SectionCard>
          </Containers>
        </SectionContainer>
      </ContentWrapper>
    </TeacherProfileWrapper>
  );
}

export default TeacherProfile;
