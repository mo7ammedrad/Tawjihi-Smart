// React
import { useState } from "react";

// Yup
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Axios
import axios from "axios";

// Hooks
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

// Components
import { H3, Pargrahph } from "../../components/typography";

// Styled
import {
  FormGroup,
  Label,
  Input,
  Button,
  ErrorText,
  FormActions,
  FormForgetPassword,
} from "./style";

// Paths
import { PATH } from "../../routes";

// URL
import { API_URL } from "../../config";

// Validation Schema
//=======================================================
const schema = yup
  .object()
  .shape({
    email: yup
      .string()
      .required("البريد الإلكتروني مطلوب")
      .email("ادخل البريد الالكتروني بشكل صحيح"),
  })
  .noUnknown(true);
//=======================================================



export const ForgetPassword = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  //submit data
  //=======================================================
  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");


    try {
      const response = await axios.post(`${API_URL}/auth/forgetPassword`, data);

      localStorage.setItem("email", data.email);
      navigate(`/${PATH.VerificationCode}`);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "حدث خطأ أثناء إرسال البريد الإلكتروني. حاول مرة أخرى.";

      localStorage.removeItem("email");
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };
  //=======================================================

  return (
    <FormForgetPassword onSubmit={handleSubmit(onSubmit)}>
      {serverError && <ErrorText>{serverError}</ErrorText>}

      <FormGroup>
        <H3>إعادة تعيين كلمة المرور</H3>
        <Pargrahph size="16px">
          من فضلك أدخل بريدك الإلكتروني لإرسال رمز التحقق لإعادة تعيين كلمة
          المرور
        </Pargrahph>

        <Label>البريد الإلكتروني</Label>
        <Input type="email" {...register("email")} disabled={loading} />
        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
      </FormGroup>

      <FormActions>
        <Button type="submit" disabled={loading}>
          {loading ? "جاري الإرسال..." : "ارسل كود التحقق"}
        </Button>
      </FormActions>
    </FormForgetPassword>
  );
};
