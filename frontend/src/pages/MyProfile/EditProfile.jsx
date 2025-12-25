// EditProfile.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ButtonGroup,
  CancelButton,
  Container,
  ErrorText,
  FormCard,
  FormGrid,
  FormGroup,
  Header,
  HiddenInput,
  ImageUploadOverlay,
  ImageUploadText,
  Input,
  MaxWidthContainer,
  ProfileImage,
  ProfileImageContainer,
  ProfileImageSection,
  SaveButton,
  Select,
  Subtitle,
  TextArea,
  UploadIcon,
  Title,
  Form,
  NotificationContainer,
  NotificationIcon,
  NotificationMessage,
  LoadingSpinner,
  PasswordLink,
  FormSection,
  SectionTitle,
  InputGroup,
  IconWrapper,
  FloatingLabel,
  ProgressIndicator,
  SuccessMessage,
} from "./style";
import axios from "axios";
import { API_URL } from "../../config";

function EditProfile() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roleUser: "طالب",
    bio: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        roleUser: user.roleUser || "طالب",
        bio: user.bio || "",
      });
      setImagePreview(user.profileImage || "");
    }
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    setErrors((prev) => ({ ...prev, profileImage: "" }));
    const file = e.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "الملف يجب أن يكون صورة فقط",
        }));
        return;
      }

      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "تنسيق البريد غير صالح";
    if (formData.phone && !/^[+]?[\d\s\-()]+$/.test(formData.phone))
      newErrors.phone = "رقم الهاتف غير صالح";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append("name", formData.name);
      submitFormData.append("email", formData.email);
      submitFormData.append("phone", formData.phone);
      submitFormData.append("bio", formData.bio);
      if (imageFile) submitFormData.append("coverImage", imageFile);

      const response = await axios.patch(
        `${API_URL}/users/updateMe`,
        submitFormData,
        { withCredentials: true }
      );


      const updatedUser = { ...response.data.data.updatedDoc };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      showNotification("success", "تم تحديث الملف الشخصي بنجاح!");
      setTimeout(() => {
        navigate("/user/user-profile");
      }, 2000);
    } catch (err) {
      console.error(err);
      showNotification("error", "حدث خطأ ما. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/user/user-profile");
  };

  return (
    <Container>
      <MaxWidthContainer>
        <Header>
          <Title>✨ تعديل الملف الشخصي</Title>
          <Subtitle>قم بتحديث بيانات حسابك وإضفاء لمستك الشخصية</Subtitle>
        </Header>

        <FormCard>
          <Form onSubmit={onSubmit} noValidate>
            <ProfileImageSection>
              <ProfileImageContainer>
                <ProfileImage
                  src={
                    imagePreview ||
                    "/placeholder.svg?height=150&width=150&query=profile avatar"
                  }
                  alt="الصورة الشخصية"
                  onClick={() =>
                    !isSubmitting && fileInputRef.current?.click()
                  }
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    !isSubmitting &&
                    fileInputRef.current?.click()
                  }
                  role="button"
                  aria-label="رفع صورة الملف الشخصي"
                  title="اضغط لتغيير الصورة"
                  hasImage={!!imagePreview}
                  style={{
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    boxShadow: isSubmitting ? "none" : "0 0 8px #667eea",
                    transition: "box-shadow 0.3s ease",
                  }}
                />
                {!isSubmitting && (
                  <ImageUploadOverlay
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadIcon>📸</UploadIcon>
                    <ImageUploadText>تغيير الصورة</ImageUploadText>
                  </ImageUploadOverlay>
                )}
              </ProfileImageContainer>

              <HiddenInput
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                aria-describedby="profileImageError"
                disabled={isSubmitting}
              />

              {uploadProgress > 0 && uploadProgress < 100 && (
                <ProgressIndicator aria-label="Upload progress">
                  <div style={{ width: `${uploadProgress}%` }} />
                </ProgressIndicator>
              )}

              {errors.profileImage && (
                <ErrorText id="profileImageError">
                  ⚠️ {errors.profileImage}
                </ErrorText>
              )}
            </ProfileImageSection>

            <FormSection>
              <SectionTitle>📋 المعلومات الشخصية</SectionTitle>
              <FormGrid>
                {[
                  {
                    id: "name",
                    label: "الاسم الكامل",
                    type: "text",
                    icon: "👤",
                    required: true,
                    error: errors.name,
                    disabled: isSubmitting,
                  },
                  {
                    id: "email",
                    label: "البريد الإلكتروني",
                    type: "email",
                    icon: "📧",
                    required: true,
                    error: errors.email,
                    disabled: isSubmitting,
                  },
                  {
                    id: "phone",
                    label: "رقم الهاتف",
                    type: "tel",
                    icon: "📱",
                    required: false,
                    error: errors.phone,
                    disabled: isSubmitting,
                  },
                ].map(
                  ({ id, label, type, icon, required, error, disabled }) => (
                    <FormGroup key={id}>
                      <InputGroup>
                        <IconWrapper>{icon}</IconWrapper>
                        <Input
                          id={id}
                          name={id}
                          type={type}
                          value={formData[id]}
                          onChange={handleInputChange}
                          placeholder=" "
                          aria-invalid={error ? "true" : "false"}
                          aria-describedby={`${id}Error`}
                          hasError={!!error}
                          disabled={disabled}
                          required={required}
                        />
                        <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
                      </InputGroup>
                      {error && (
                        <ErrorText id={`${id}Error`}>❌ {error}</ErrorText>
                      )}
                    </FormGroup>
                  )
                )}

                <FormGroup>
                  <InputGroup>
                    <IconWrapper>🎭</IconWrapper>
                    <Select
                      id="roleUser"
                      name="roleUser"
                      value={formData.roleUser}
                      onChange={handleInputChange}
                      disabled
                      aria-readonly="true"
                    >
                      <option value="طالب">طالب</option>
                      <option value="معلم">معلم</option>
                      <option value="مدير">مدير</option>
                    </Select>
                    <FloatingLabel htmlFor="roleUser">الدور</FloatingLabel>
                  </InputGroup>
                </FormGroup>

                <FormGroup className="full-width">
                  <InputGroup>
                    <IconWrapper>📝</IconWrapper>
                    <TextArea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="اكتب نبذة مختصرة عن نفسك..."
                      disabled={isSubmitting}
                    />
                    <FloatingLabel htmlFor="bio">النبذة الشخصية</FloatingLabel>
                  </InputGroup>
                </FormGroup>
              </FormGrid>
            </FormSection>

            <FormSection>
              <SectionTitle>🔐 الأمان والحماية</SectionTitle>
              <PasswordLink>
                <Link
                  to="/user/change-password"
                  tabIndex={isSubmitting ? -1 : 0}
                  aria-disabled={isSubmitting}
                >
                  <span>🔑</span> تغيير كلمة المرور
                </Link>
              </PasswordLink>
            </FormSection>

            <ButtonGroup>
              <CancelButton
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <span>❌</span> إلغاء
              </CancelButton>
              <SaveButton
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner aria-label="جارٍ الحفظ" />
                    جارٍ الحفظ...
                  </>
                ) : (
                  <>
                    <span>💾</span> حفظ التغييرات
                  </>
                )}
              </SaveButton>
            </ButtonGroup>
          </Form>
        </FormCard>

        {notification && (
          <NotificationContainer
            type={notification.type}
            role="alert"
            aria-live="assertive"
            style={{ animation: "slideIn 0.3s ease forwards" }}
          >
            <NotificationIcon>
              {notification.type === "success" ? "✅" : "❌"}
            </NotificationIcon>
            <NotificationMessage>{notification.message}</NotificationMessage>
          </NotificationContainer>
        )}

        {notification?.type === "success" && (
          <SuccessMessage aria-live="polite">
            <div>🎉 تم الحفظ بنجاح! سيتم توجيهك خلال ثوانٍ...</div>
          </SuccessMessage>
        )}
      </MaxWidthContainer>
    </Container>
  );
}

export default EditProfile;
