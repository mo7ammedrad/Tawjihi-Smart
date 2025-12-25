"use client";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../routes";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Container = styled.div`
  max-width: 450px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  direction: rtl;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  text-align: center;
  color: #2d3748;
  font-size: 1.8rem;
  font-weight: 700;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 2px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
  transition: color 0.2s ease;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: #f7fafc;
  transition: all 0.3s ease;
  color: #2d3748;

  &:focus {
    border-color: #667eea;
    outline: none;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const ErrorText = styled.span`
  color: #e53e3e;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: block;
  font-weight: 500;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: linear-gradient(135deg, #a0aec0 0%, #cbd5e0 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover:not(:disabled)::before {
    left: 100%;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const PasswordStrengthIndicator = styled.div`
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    height: 100%;
    background: ${(props) => {
      if (props.strength === "weak") return "#e53e3e";
      if (props.strength === "medium") return "#ed8936";
      if (props.strength === "strong") return "#38a169";
      return "#e2e8f0";
    }};
    width: ${(props) => {
      if (props.strength === "weak") return "33%";
      if (props.strength === "medium") return "66%";
      if (props.strength === "strong") return "100%";
      return "0%";
    }};
    transition: all 0.3s ease;
  }
`;

export default function ChangePassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const newPassword = watch("newPassword");

  const getPasswordStrength = (password) => {
    if (!password) return "";
    if (password.length < 6) return "weak";
    if (password.length < 10) return "medium";
    return "strong";
  };

  const onSubmit = async (data) => {
    try {
      await axios.patch(
        `${API_URL}/users/changePassword`,
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          newConfirmPassword: data.newConfirmPassword,
        },
        { withCredentials: true }
      );
      toast.success("تم تغيير كلمة المرور بنجاح!");
      navigate(`/user/${PATH.UserProfile}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل في تغيير كلمة المرور.");
    }
  };

  return (
    <PageWrapper>
      <Container>
        <Title>تغيير كلمة المرور</Title>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="أدخل كلمة المرور الحالية"
              {...register("currentPassword", {
                required: "كلمة المرور الحالية مطلوبة",
              })}
            />
            {errors.currentPassword && (
              <ErrorText>{errors.currentPassword.message}</ErrorText>
            )}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="أدخل كلمة المرور الجديدة"
              {...register("newPassword", {
                required: "كلمة المرور الجديدة مطلوبة",
                minLength: {
                  value: 6,
                  message: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
                },
              })}
            />
            <PasswordStrengthIndicator
              strength={getPasswordStrength(newPassword)}
            />
            {errors.newPassword && (
              <ErrorText>{errors.newPassword.message}</ErrorText>
            )}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="newConfirmPassword">
              تأكيد كلمة المرور الجديدة
            </Label>
            <Input
              id="newConfirmPassword"
              type="password"
              placeholder="أعد إدخال كلمة المرور الجديدة"
              {...register("newConfirmPassword", {
                required: "يرجى تأكيد كلمة المرور الجديدة",
                validate: (value) =>
                  value === watch("newPassword") ||
                  "كلمتا المرور غير متطابقتين",
              })}
            />
            {errors.newConfirmPassword && (
              <ErrorText>{errors.newConfirmPassword.message}</ErrorText>
            )}
          </InputGroup>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <LoadingSpinner />}
            {isSubmitting ? "جاري التغيير..." : "تغيير كلمة المرور"}
          </Button>
        </Form>
      </Container>
    </PageWrapper>
  );
}
