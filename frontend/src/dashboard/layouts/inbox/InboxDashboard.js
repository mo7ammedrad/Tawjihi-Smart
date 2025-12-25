import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import MDBox from "../../components/MDBox";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";

const InboxDashboard = () => {
  const [tab, setTab] = useState(0);
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [form, setForm] = useState({ to: "", subject: "", body: "" });
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch (e) {
      return {};
    }
  }, []);

  const loadData = async () => {
    setError("");
    try {
      const [inboxRes, sentRes] = await Promise.all([
        axios.get(`${API_URL}/messages/inbox`, { withCredentials: true }),
        axios.get(`${API_URL}/messages/sent`, { withCredentials: true }),
      ]);
      setInbox(inboxRes.data?.messages || []);
      setSent(sentRes.data?.messages || []);

      if (user?.role === "teacher") {
        const coursesRes = await axios.get(`${API_URL}/courses?teacher=${user._id || user.id}`, {
          withCredentials: true,
        });
        const courseIds = (coursesRes.data?.data?.docs || []).map((c) => c._id);

        const enrollments = [];
        for (const cId of courseIds) {
          try {
            const enrollRes = await axios.get(`${API_URL}/enrollments?course=${cId}`, { withCredentials: true });
            enrollments.push(...(enrollRes.data?.data?.docs || []));
          } catch (e) {
            // ignore per-course errors
          }
        }

        const students = [];
        enrollments.forEach((en) => {
          const u = en?.user;
          if (!u) return;
          const id = u._id || u.id || u;
          if (!students.find((s) => s.id === id)) {
            students.push({
              id,
              name: u.name || "غير متوفر",
              email: u.email || "",
              course: en?.course?.name || en?.course?.title || "",
            });
          }
        });
        setEnrolledStudents(students);
        if (students.length && !form.to) {
          setForm((f) => ({ ...f, to: students[0].id }));
        }
      } else {
        setEnrolledStudents([]);
      }
    } catch (e) {
      setError("حدث خطأ أثناء تحميل الرسائل.");
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast.open) return;
    const id = setTimeout(() => setToast((t) => ({ ...t, open: false })), 5000);
    return () => clearTimeout(id);
  }, [toast.open]);

  const handleSend = async () => {
    if (!form.to || !form.body) {
      setError("يرجى اختيار المستلم وكتابة المحتوى.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API_URL}/messages`, form, { withCredentials: true });
      setForm({ to: "", subject: "", body: "" });
      loadData();
      setToast({ open: true, message: "تم إرسال الرسالة بنجاح.", severity: "success" });
    } catch (e) {
      setError("فشل إرسال الرسالة.");
      setToast({ open: true, message: "فشل إرسال الرسالة.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    if (!id) return;
    // Optimistic UI: mark as read locally
    setInbox((prev) => prev.map((m) => (m._id === id ? { ...m, read: true } : m)));
    try {
      await axios.patch(`${API_URL}/messages/${id}/read`, {}, { withCredentials: true });
    } catch (e) {
      // ignore to avoid blocking UX
    }
  };

  const handleMessageClick = (msg) => {
    if (!msg || msg.read || tab !== 2) return;
    markRead(msg._id);
  };

  const renderList = (list, isInbox) => (
    <Box
      sx={{
        display: "grid",
        gap: 1.5,
        p: 1,
      }}
    >
      {list.map((msg) => {
        const name = isInbox ? (msg.sender?.name || "غير متوفر") : (msg.recipient?.name || "غير متوفر");
        const email = isInbox ? msg.sender?.email : msg.recipient?.email;
        return (
          <Card
            key={msg._id}
            onClick={() => handleMessageClick(msg)}
            sx={{
              p: 2,
              border: "1px solid #eef1f4",
              boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
              borderRadius: 3,
              background: isInbox && !msg.read ? "#f2f6ff" : "#fff",
              cursor: isInbox ? "pointer" : "default",
              position: "relative",
            }}
          >
            {isInbox && !msg.read && (
              <Box
                sx={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#0d6efd",
                }}
              />
            )}
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ width: 32, height: 32, bgcolor: isInbox ? "#0dcaf0" : "#0d6efd" }}>
                  {name?.[0]?.toUpperCase() || "?"}
                </Avatar>
                <div>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {name}
                  </Typography>
                  {email && (
                    <Typography variant="caption" color="text.secondary">
                      {email}
                    </Typography>
                  )}
                </div>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {new Date(msg.createdAt).toLocaleString()}
              </Typography>
            </MDBox>
            <Typography variant="subtitle2" fontWeight={700} mb={0.3}>
              {msg.subject || "بدون عنوان"}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              mb={0.75}
              sx={{ whiteSpace: "pre-wrap", fontSize: 15, lineHeight: 1.6 }}
            >
              {msg.body}
            </Typography>
            <MDBox display="flex" gap={1} alignItems="center" flexWrap="wrap" mt={0.5}>
              {isInbox && !msg.read && (
                <Button
                  size="medium"
                  variant="contained"
                  color="info"
                  onClick={() => markRead(msg._id)}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    px: 1.6,
                    py: 0.7,
                    fontSize: 14,
                  }}
                >
                  تعليم كمقروء
                </Button>
              )}
              {isInbox && msg.read && (
                <Chip
                  label="مقروء"
                  size="medium"
                  color="success"
                  variant="filled"
                  sx={{ fontWeight: 800, px: 1.6, letterSpacing: 0.3, fontSize: 13 }}
                />
              )}
              {isInbox && (
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    setTab(0) ||
                    setForm({
                      to: msg.sender?._id || msg.sender?.id || msg.sender,
                      subject: msg.subject ? `رد: ${msg.subject}` : "رد",
                      body: "",
                    })
                  }
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 800,
                    px: 1.8,
                    py: 0.9,
                    fontSize: 14,
                    background: "linear-gradient(90deg, #0d6efd, #7c32ff)",
                    boxShadow: "0 10px 20px rgba(13,110,253,0.18)",
                    "&:hover": {
                      boxShadow: "0 12px 24px rgba(13,110,253,0.25)",
                    },
                  }}
                >
                  رد
                </Button>
              )}
              {!isInbox && (
                <Chip
                  label={msg.read ? "مقروء" : "غير مقروء"}
                  size="medium"
                  color={msg.read ? "success" : "default"}
                  variant={msg.read ? "outlined" : "filled"}
                  sx={{
                    ml: "auto",
                    fontWeight: 800,
                    letterSpacing: 0.3,
                    px: 1.4,
                    borderColor: msg.read ? "#198754" : "#1f2d3d",
                    color: msg.read ? "#198754" : "#1f2d3d",
                    backgroundColor: msg.read ? "transparent" : "#f0f2f5",
                  }}
                />
              )}
            </MDBox>
          </Card>
        );
      })}
      {!list.length && <Typography color="text.secondary">لا توجد رسائل.</Typography>}
    </Box>
  );

  const renderCompose = () => (
    <Box
      sx={{
        display: "grid",
        gap: 1.8,
        p: 2.4,
        background: "#f8fafc",
        borderRadius: 4,
        border: "1px solid #eef1f4",
        boxShadow: "0 12px 26px rgba(0,0,0,0.06)",
      }}
    >
      {toast.open && (
        <Alert severity={toast.severity} sx={{ mb: 1 }}>
          {toast.message}
        </Alert>
      )}

      {user?.role === "teacher" ? (
        <FormControl
          fullWidth
          size="medium"
          sx={{ "& .MuiInputBase-root": { borderRadius: 3, fontSize: 15, py: 1.3, backgroundColor: "#fff" } }}
        >
          <InputLabel>اختر الطالب (من كورساتك)</InputLabel>
          <Select
            label="اختر الطالب (من كورساتك)"
            value={form.to}
            onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
          >
            {!enrolledStudents.length && <MenuItem value="">لا يوجد طلاب مسجلون بعد</MenuItem>}
            {enrolledStudents.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name} — {s.course}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <TextField
          label="المستلم (UserId)"
          value={form.to}
          onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
          size="medium"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: 3, fontSize: 15, py: 1.3, backgroundColor: "#fff" },
          }}
        />
      )}

      <TextField
        label="العنوان"
        value={form.subject}
        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
        size="medium"
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": { borderRadius: 3, fontSize: 15, py: 1.3, backgroundColor: "#fff" },
        }}
      />
      <TextField
        label="المحتوى"
        value={form.body}
        onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
        size="medium"
        multiline
        minRows={4}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": { borderRadius: 3, fontSize: 15, py: 1.3, backgroundColor: "#fff" },
        }}
      />
      <Button
        variant="contained"
        onClick={handleSend}
        disabled={loading}
        sx={{
          borderRadius: 2,
          py: 1.3,
          fontWeight: 800,
          textTransform: "none",
          fontSize: 16,
          background: "linear-gradient(90deg, #0d6efd, #7c32ff)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 10px 24px rgba(13,110,253,0.25)",
          },
        }}
      >
        {loading ? "جاري الإرسال..." : "إرسال"}
      </Button>
    </Box>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3} px={1}>
        <Card style={{ padding: 16, marginBottom: 16 }}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            الرسائل
          </Typography>
          {error && (
            <Typography color="error" mb={1}>
              {error}
            </Typography>
          )}
          <Tabs value={tab} onChange={(e, v) => setTab(v)} textColor="primary" indicatorColor="primary">
            <Tab label={<MDBox display="flex" alignItems="center" gap={0.5}><Icon>edit</Icon>إرسال</MDBox>} />
            <Tab label={<MDBox display="flex" alignItems="center" gap={0.5}><Icon>send</Icon>الصادر</MDBox>} />
            <Tab label={<MDBox display="flex" alignItems="center" gap={0.5}><Icon>inbox</Icon>الوارد</MDBox>} />
          </Tabs>

          <MDBox mt={2}>
            {tab === 0 && renderCompose()}
            {tab === 1 && renderList(sent, false)}
            {tab === 2 && renderList(inbox, true)}
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default InboxDashboard;
