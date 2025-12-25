"use client";

import { useNavigate } from "react-router-dom";
import {
  AboutText,
  AvatarContainer,
  AvatarImage,
  Container,
  CoverImage,
  DetailContent,
  DetailIcon,
  DetailItem,
  DetailLabel,
  DetailsGrid,
  DetailValue,
  EditButton,
  HeaderSection,
  LastCard,
  MaxWidthContainer,
  Overlay,
  ProfileCard,
  ProfileContent,
  ProfileHeader,
  ProfileInfo,
  ProfileSection,
  RoleBadge,
  SectionCard,
  SectionContent,
  SectionDescription,
  SectionTitle,
  StatBar,
  StatCard,
  StatContent,
  StatIcon,
  StatInfo,
  StatLabel,
  StatsGrid,
  StatValue,
  UserDetails,
  UserEmail,
  UserName,
} from "./style";

import { Avatar } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../config";
import { useEffect, useState } from "react";
import { PATH } from "../../routes";

function UserProfile() {
  const navigate = useNavigate();

  const dataUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = dataUser._id;

  const {
    name = "اسم المستخدم",
    email = "بريد غير متوفر",
    description = "وصف غير متوفر",
    role = "user",
    profileImage,
    joinedAt,
    coverImage,
    cart = [],
    wishlist = [],
  } = dataUser;

  const accountDetails = [
    { label: "الاسم", value: name, icon: "👤" },
    { label: "البريد الإلكتروني", value: email, icon: "✉️" },
    {
      label: "الدور",
      value: role === "user" ? "طالب" : role,
      icon: "🎓",
    },
    { label: "عضو منذ", value: joinedAt || "2024", icon: "📅" },
  ];

  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/enrollments?user=${userId}`,
          { withCredentials: true }
        );
        setEnrolledCourses(response.data.data.docs);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };
    fetchEnrolledCourses();
  }, [userId]);

  const coursesStats = [
    {
      label: "الدورات المسجَّل بها",
      value:
        enrolledCourses.length > 0
          ? `${enrolledCourses.length} دورات`
          : "لا توجد دورات مسجلة",
      icon: "📚",
      color: "#3b82f6",
    },
    {
      label: "الدورات في السلة",
      value:
        cart.length > 0 ? `${cart.length} دورات` : "لا توجد دورات في السلة",
      icon: "🏆",
      color: "#10b981",
    },
    {
      label: "المفضلة",
      value:
        wishlist.length > 0
          ? `${wishlist.length} دورات`
          : "لا توجد دورات مفضلة",
      icon: "⭐",
      color: "#f59e0b",
    },
  ];

  const handleEditProfile = () => {
    navigate(`/user/${PATH.EditProfile}`);
  };

  return (
    <Container>
      {/* Header with cover image */}
      <HeaderSection>
        <CoverImage
          src={coverImage || "/placeholder.svg"}
          alt={`صورة ${name}`}
        />
        <Overlay />
      </HeaderSection>

      {/* Profile section */}
      <ProfileSection>
        <MaxWidthContainer>
          {/* Profile Card */}
          <ProfileCard>
            <ProfileContent>
              <ProfileHeader>
                {/* Avatar */}
                <AvatarContainer>
                  {profileImage ? (
                    <Avatar>
                      <AvatarImage src={profileImage} alt={name} />
                    </Avatar>
                  ) : (
                    <Avatar>{name?.charAt(0)}</Avatar>
                  )}
                </AvatarContainer>

                <ProfileInfo>
                  <UserDetails>
                    <UserName>{name}</UserName>
                    <UserEmail>
                      <span>✉️</span>
                      {email}
                    </UserEmail>
                    <RoleBadge>{role === "user" ? "طالب" : role}</RoleBadge>
                  </UserDetails>

                  <EditButton onClick={handleEditProfile}>
                    <span>✏️</span>
                    تعديل الملف الشخصي
                  </EditButton>
                </ProfileInfo>
              </ProfileHeader>
            </ProfileContent>
          </ProfileCard>

          {/* About section */}
          <SectionCard>
            <SectionContent>
              <SectionTitle>نبذة</SectionTitle>
              <AboutText>
                {description ||
                  "لم يقم هذا المستخدم بإضافة نبذة حتى الآن. يمكنك هنا كتابة اهتماماتك أو أهدافك التعليمية أو مهنتك."}
              </AboutText>
            </SectionContent>
          </SectionCard>

          {/* Account details */}
          <SectionCard>
            <SectionContent>
              <SectionTitle>تفاصيل الحساب</SectionTitle>
              <SectionDescription>معلومات حسابك الأساسية</SectionDescription>

              <DetailsGrid>
                {accountDetails.map(({ label, value, icon }) => (
                  <DetailItem key={label}>
                    <DetailIcon>{icon}</DetailIcon>
                    <DetailContent>
                      <DetailLabel>{label}</DetailLabel>
                      <DetailValue>{value}</DetailValue>
                    </DetailContent>
                  </DetailItem>
                ))}
              </DetailsGrid>
            </SectionContent>
          </SectionCard>

          {/* Courses statistics */}
          <LastCard>
            <SectionContent>
              <SectionTitle>دوراتي</SectionTitle>
              <SectionDescription>إحصائيات دوراتك التعليمية</SectionDescription>

              <StatsGrid>
                {coursesStats.map(({ label, value, icon, color }) => (
                  <StatCard key={label}>
                    <StatContent>
                      <StatInfo>
                        <StatLabel>{label}</StatLabel>
                        <StatValue>{value}</StatValue>
                      </StatInfo>
                      <StatIcon color={color}>{icon}</StatIcon>
                    </StatContent>
                    <StatBar color={color} />
                  </StatCard>
                ))}
              </StatsGrid>
            </SectionContent>
          </LastCard>
        </MaxWidthContainer>
      </ProfileSection>
    </Container>
  );
}

export default UserProfile;
