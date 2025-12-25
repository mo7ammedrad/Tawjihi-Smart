import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { Containers } from "../components/Container";
import { NavBar } from "../layout/navBar";
import { LogoAndButton } from "../components/LogoAndButton";
import { ModalTeacher } from "../components/modalTeacher";
import Loading from "../components/Loading";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const InboxStudent = () => {
  const [tab, setTab] = useState("inbox");
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [form, setForm] = useState({ to: "", subject: "", body: "" });
  const [enrolledTeachers, setEnrolledTeachers] = useState([]);
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

  useEffect(() => {
    if (!toast.open) return;
    const id = setTimeout(() => setToast((t) => ({ ...t, open: false })), 5000);
    return () => clearTimeout(id);
  }, [toast.open]);

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const [inboxRes, sentRes, enrollRes] = await Promise.all([
        axios.get(`${API_URL}/messages/inbox`, { withCredentials: true }),
        axios.get(`${API_URL}/messages/sent`, { withCredentials: true }),
        axios.get(`${API_URL}/enrollments`, { withCredentials: true }),
      ]);
      setInbox(inboxRes.data?.messages || []);
      setSent(sentRes.data?.messages || []);

      const enrollments = enrollRes?.data?.data?.docs || [];
      const teachers = [];
      enrollments.forEach((en) => {
        const teacher = en?.course?.teacher;
        if (teacher) {
          const tId = teacher._id || teacher.id || teacher;
          if (!teachers.find((t) => t.id === tId)) {
            teachers.push({
              id: tId,
              name: teacher.name || "غير متوفر",
              course: en.course?.name || en.course?.title || "غير متوفر",
            });
          }
        }
      });
      setEnrolledTeachers(teachers);
      if (teachers.length && !form.to) {
        setForm((f) => ({ ...f, to: teachers[0].id }));
      }
    } catch (e) {
      setError("حدث خطأ أثناء تحميل الرسائل.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = async () => {
    if (!form.to || !form.body) {
      setError("يرجى اختيار المستلم وكتابة المحتوى.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API_URL}/messages`, form, { withCredentials: true });
      setForm({ to: enrolledTeachers[0]?.id || "", subject: "", body: "" });
      setToast({ open: true, message: "تم إرسال الرسالة بنجاح.", severity: "success" });
      load();
    } catch (e) {
      setError("فشل إرسال الرسالة.");
      setToast({ open: true, message: "فشل إرسال الرسالة.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    if (!messageId) return;
    setInbox((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, read: true } : msg)));
    try {
      await axios.patch(`${API_URL}/messages/${messageId}/read`, {}, { withCredentials: true });
    } catch (e) {
      // ignore to keep UI responsive
    }
  };

  const list = tab === "inbox" ? inbox : sent;

  const handleMessageClick = (msg) => {
    if (tab !== "inbox" || msg.read) return;
    markAsRead(msg._id);
  };

  return (
    <>
      <LogoAndButton />
      <NavBar />
      <ModalTeacher />
      <Containers>
        <div
          style={{
            padding: 16,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginBottom: 10 }}>الرسائل</h3>
          {error && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                marginBottom: 10,
                background: "rgba(220,53,69,0.1)",
                color: "#c53030",
                border: "1px solid #f5c2c7",
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
              margin: "16px 0 18px",
            }}
          >
            {[
              { key: "compose", label: "إرسال" },
              { key: "sent", label: "الصادر" },
              { key: "inbox", label: "الوارد" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  flex: "1 1 160px",
                  border: "1px solid #dfe3e8",
                  borderRadius: 10,
                  padding: "14px 18px",
                  minWidth: 140,
                  textAlign: "center",
                  fontSize: 16,
                  background: tab === t.key ? "linear-gradient(90deg,#0d6efd,#7c32ff)" : "#fff",
                  color: tab === t.key ? "#fff" : "#1f2d3d",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: tab === t.key ? "0 10px 20px rgba(13,110,253,0.18)" : "none",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading && <Loading />}

          {tab === "compose" && (
            <div
              style={{
                display: "grid",
                gap: 12,
                padding: 14,
                background: "#f8fafc",
                borderRadius: 16,
                border: "1px solid #eef1f4",
                boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: "#344767" }}>اختر المعلم (من كورساتك)</label>
                <select
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "1px solid #dfe3e8",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                  value={form.to}
                  onChange={(e) => setForm({ ...form, to: e.target.value })}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px rgba(13,110,253,0.15)")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                >
                  {!enrolledTeachers.length && <option value="">لا يوجد معلمون مرتبطون بدوراتك بعد</option>}
                  {enrolledTeachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.course}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: "#344767" }}>العنوان</label>
                <input
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "1px solid #dfe3e8",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                  placeholder="اكتب عنوان الرسالة"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px rgba(13,110,253,0.15)")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: "#344767" }}>المحتوى</label>
                <textarea
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "1px solid #dfe3e8",
                    minHeight: 180,
                    resize: "vertical",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    fontSize: 15,
                  }}
                  placeholder="اكتب رسالتك هنا..."
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px rgba(13,110,253,0.15)")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
              </div>
              <Button
                variant="contained"
                onClick={send}
                disabled={loading}
                sx={{
                  borderRadius: 12,
                  py: 1.4,
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
            </div>
          )}

          {tab !== "compose" && (
            <div style={{ display: "grid", gap: 10 }}>
              {list.map((msg) => {
                const isInbox = tab === "inbox";
                const name = isInbox ? (msg.sender?.name || "غير متوفر") : (msg.recipient?.name || "غير متوفر");
                const email = isInbox ? msg.sender?.email : msg.recipient?.email;
                return (
                  <div
                    key={msg._id}
                    onClick={() => handleMessageClick(msg)}
                    style={{
                      border: "1px solid #eef1f4",
                      borderRadius: 10,
                      padding: 12,
                      boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
                      background: isInbox && !msg.read ? "#f2f6ff" : "#fff",
                      cursor: isInbox ? "pointer" : "default",
                      position: "relative",
                    }}
                  >
                    {isInbox && !msg.read && (
                      <span
                        style={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: "#0d6efd",
                        }}
                      />
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "#0d6efd" }}>{name?.[0]?.toUpperCase() || "?"}</Avatar>
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
                      </div>
                      <span style={{ color: "#6c757d", fontSize: 12 }}>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{msg.subject || "بدون عنوان"}</div>
                    <div style={{ color: "#6c757d", whiteSpace: "pre-wrap", fontSize: 14, marginBottom: 8 }}>{msg.body}</div>
                    {isInbox && (
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setTab("compose");
                            setForm({
                              to: msg.sender?._id || msg.sender?.id || msg.sender,
                              subject: msg.subject ? `رد: ${msg.subject}` : "رد",
                              body: "",
                            });
                          }}
                          sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            px: 1.6,
                            py: 0.6,
                          }}
                        >
                          رد
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
              {!list.length && <div style={{ color: "#6c757d" }}>لا توجد رسائل.</div>}
            </div>
          )}
        </div>
      </Containers>

      {toast.open && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: toast.severity === "success" ? "linear-gradient(90deg,#0d6efd,#7c32ff)" : "#dc3545",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 12,
            boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
            fontWeight: 700,
            zIndex: 1300,
            minWidth: 240,
            textAlign: "center",
          }}
        >
          {toast.message}
        </div>
      )}
    </>
  );
};

export default InboxStudent;
