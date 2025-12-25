import { useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";

import MDBox from "../../components/MDBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import { API_URL } from "../../../config";

export default function Broadcast() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("العنوان مطلوب");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/notifications/broadcast`,
        { title, body, link: link.trim() ? link : undefined },
        { withCredentials: true }
      );
      const created = res?.data?.data?.created;
      toast.success(typeof created === "number" ? `تم إرسال الإشعار إلى ${created} مستخدم` : "تم إرسال الإشعار");
      setTitle("");
      setBody("");
      setLink("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "تعذر إرسال الإشعار");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                إرسال إشعار
              </Typography>

              <form onSubmit={submit}>
                <TextField
                  label="العنوان"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="الرسالة"
                  fullWidth
                  multiline
                  minRows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="رابط (اختياري)"
                  fullWidth
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? "جاري الإرسال..." : "إرسال"}
                </Button>
              </form>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
