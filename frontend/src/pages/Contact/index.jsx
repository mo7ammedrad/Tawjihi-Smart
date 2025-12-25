import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { NavBar } from "../../layout/navBar";
import Footer from "../../layout/footer";
import { LogoAndButton } from "../../components/LogoAndButton";
import { ModalTeacher } from "../../components/modalTeacher";
import { Containers } from "../../components/Container";
import { API_URL } from "../../config";

import { Field, Form, Header, Page, Submit } from "./style";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/contact`, { name, email, message });
      toast.success("تم إرسال الرسالة");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "تعذر إرسال الرسالة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <ModalTeacher isOpen="true" />
      <LogoAndButton />
      <NavBar />

      <Containers>
        <Header>
          <h1>تواصل معنا</h1>
          <p>أرسل لنا رسالة وسنقوم بالرد عليك.</p>
        </Header>

        <Form onSubmit={submit}>
          <Field>
            <label>الاسم</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>

          <Field>
            <label>البريد الإلكتروني</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>

          <Field>
            <label>الرسالة</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
          </Field>

          <Submit type="submit" disabled={loading}>
            {loading ? "جاري الإرسال..." : "إرسال"}
          </Submit>
        </Form>
      </Containers>

      <Footer />
    </Page>
  );
};

export default Contact;
