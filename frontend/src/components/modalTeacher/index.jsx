// react
import { useContext, useEffect, useState } from "react";

// style
import { ModalDiv, Form, FormGroup, Label, Input, Button, CancelButton, ErrorText } from "./style";

// yup
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// context
import { ModalContext } from "../../context/ModalContext";

// hooks
import { useForm } from "react-hook-form";

// axios
import axios from "axios";

// API URL
import { API_URL } from "../../config";

// MUI Library
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Password regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

// Validation schema
//=========================================================================
const schema = yup.object({
  name: yup.string().required("الاسم مطلوب").min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  phone: yup.string().required("رقم الهاتف مطلوب"),
  email: yup.string().required("البريد الإلكتروني مطلوب").email("صيغة البريد الإلكتروني غير صحيحة"),
  password: yup.string().required("كلمة المرور مطلوبة").matches(passwordRegex, "invalid-password"),
  confirmPassword: yup
    .string()
    .required("تأكيد كلمة المرور مطلوب")
    .oneOf([yup.ref("password")], "كلمتا المرور غير متطابقتين"),
  cv: yup
    .mixed()
    .required("يرجى رفع ملف السيرة الذاتية بصيغة PDF")
    .test("fileType", "الملف يجب أن يكون بصيغة PDF", (value) => {
      if (!value || !value.length) return false;
      return value[0].type === "application/pdf";
    })
    .test("fileSize", "حجم الملف يجب ألا يتجاوز 5MB", (value) => {
      if (!value || !value.length) return false;
      return value[0].size <= 5 * 1024 * 1024;
    }),
});
//=========================================================================

export const ModalTeacher = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({ resolver: yupResolver(schema) });

  const { isOpen, setIsOpen } = useContext(ModalContext);
  const [res, setRes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const passwordValue = watch("password");
  const passwordRules = [
    { label: "حرف صغير (a-z)", isValid: /[a-z]/.test(passwordValue || "") },
    { label: "حرف كبير (A-Z)", isValid: /[A-Z]/.test(passwordValue || "") },
    { label: "رقم (0-9)", isValid: /\d/.test(passwordValue || "") },
    { label: "رمز خاص (@$!%*?&)", isValid: /[@$!%*?&]/.test(passwordValue || "") },
    { label: "طول 8 أحرف أو أكثر", isValid: (passwordValue || "").length >= 8 },
  ];

  const onSubmit = async (data) => {
    if (!data.cv || !data.cv.length) {
      setErrorMessage("يجب رفع ملف السيرة الذاتية بصيغة PDF.");
      return;
    }

    const file = data.cv[0];
    if (file.type !== "application/pdf") {
      setErrorMessage("الملف يجب أن يكون بصيغة PDF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("حجم الملف يجب ألا يتجاوز 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("cv", file);
    formData.append("role", "teacher");

    setIsLoading(true);
    setErrorMessage("");

    try {
      await axios.post(`${API_URL}/auth/signup`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setRes(true);
      setShowAlert(true);
      reset();
      setIsOpen(false);
      setTimeout(() => setRes(false), 10000);
    } catch (error) {
      console.error("Form error:", error);
      setErrorMessage("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    reset();
    setRes(false);
    setErrorMessage("");
    setIsOpen(false);
  };

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflowY = "auto";
      document.body.style.overflowX = "hidden";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className="modal-overlay" onClick={onCancel} />}
      <Snackbar
        open={showAlert}
        autoHideDuration={10000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="success"
          onClose={() => setShowAlert(false)}
          sx={{
            width: "400px",
            height: "80px",
            display: "flex",
            alignItems: "center",
            fontSize: "1.2rem",
          }}
        >
          تم إرسال طلبك بنجاح.
        </Alert>
      </Snackbar>

      <ModalDiv className={isOpen ? "show bodyModal" : "hide"}>
        {errorMessage && <p style={{ color: "red", marginTop: "1rem" }}>{errorMessage}</p>}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>الاسم الكامل</Label>
            <Input type="text" {...register("name")} />
            {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>البريد الإلكتروني</Label>
            <Input type="email" {...register("email")} />
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>رقم الهاتف</Label>
            <Input type="tel" {...register("phone")} />
            {errors.phone && <ErrorText>{errors.phone.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>كلمة المرور</Label>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <ErrorText>
                {errors.password.message === "invalid-password" ? (
                  <ul style={{ paddingRight: "1rem", margin: "0.5rem 0" }}>
                    {passwordRules.map((rule, index) => (
                      <li
                        key={index}
                        style={{
                          color: rule.isValid ? "green" : "red",
                          fontWeight: rule.isValid ? "bold" : "normal",
                        }}
                      >
                        {rule.label}
                      </li>
                    ))}
                  </ul>
                ) : (
                  errors.password.message
                )}
              </ErrorText>
            )}
          </FormGroup>

          <FormGroup>
            <Label>تأكيد كلمة المرور</Label>
            <Input type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && <ErrorText>{errors.confirmPassword.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>أرفق السيرة الذاتية (PDF فقط)</Label>
            <Input type="file" accept=".pdf" {...register("cv")} />
            {errors.cv && <ErrorText>{errors.cv.message}</ErrorText>}
          </FormGroup>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جارٍ الإرسال..." : "إرسال"}
            </Button>
            <CancelButton style={{ background: "red", color: "white" }} type="button" onClick={onCancel}>
              إلغاء
            </CancelButton>
          </div>
        </Form>
      </ModalDiv>
    </>
  );
};
