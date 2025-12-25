import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import MDBox from "../../components/MDBox";
import Grid from "@mui/material/Grid";
import ComplexStatisticsCard from "../../examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    courses: 0,
    lessons: 0,
    enrollments: 0,
    students: 0,
  });
  const [studentRows, setStudentRows] = useState([]);

  const teacherId = useMemo(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      return u?._id || u?.id || "";
    } catch (e) {
      return "";
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!teacherId) {
        setError("لم يتم العثور على بيانات المعلم.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        // Courses owned by teacher
        const coursesRes = await axios.get(`${API_URL}/courses?teacher=${teacherId}`, {
          withCredentials: true,
        });
        const courses = coursesRes?.data?.data?.docs || [];
        const courseIds = courses.map((c) => c._id);

        // Fetch lessons per course and enrollments per course
        let lessonsCount = 0;
        let enrollmentCount = 0;
        const studentSet = new Set();
        const studentRowsAgg = [];

        const fmtDate = (value) => {
          if (!value) return "غير متوفر";
          try {
            return new Date(value).toLocaleDateString();
          } catch (e) {
            return "غير متوفر";
          }
        };

        for (const cId of courseIds) {
          const [lessonsRes, enrollRes] = await Promise.all([
            axios
              .get(`${API_URL}/lessons?course=${cId}`, { withCredentials: true })
              .catch(() => ({ data: { data: { docs: [] } } })),
            axios
              .get(`${API_URL}/enrollments?course=${cId}`, { withCredentials: true })
              .catch(() => ({ data: { data: { docs: [] } } })),
          ]);
          const lessonDocs = lessonsRes?.data?.data?.docs || [];
          lessonsCount += lessonDocs.length;

          const enrollDocs = enrollRes?.data?.data?.docs || [];
          enrollmentCount += enrollDocs.length;
          enrollDocs.forEach((en) => {
            if (en?.user?._id) studentSet.add(en.user._id);
            else if (en?.user) studentSet.add(en.user.toString());
            studentRowsAgg.push({
              id: en?._id || `${cId}-${Math.random()}`,
              courseId: cId,
              courseName: courses.find((c) => c._id === cId)?.name || courses.find((c) => c._id === cId)?.title || "كورس",
              studentName: en?.user?.name || "طالب",
              studentEmail: en?.user?.email || "غير متوفر",
              enrolledAt: fmtDate(en?.createdAt),
            });
          });
        }

        setStats({
          courses: courses.length,
          lessons: lessonsCount,
          enrollments: enrollmentCount,
          students: studentSet.size,
        });
        setStudentRows(studentRowsAgg);
      } catch (err) {
        setError("فشل تحميل بيانات المعلم.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  const cards = [
    { title: "الكورسات", icon: "menu_book", color: "primary", value: stats.courses },
    { title: "الدروس", icon: "movie", color: "info", value: stats.lessons },
    { title: "الطلاب المسجلون", icon: "groups", color: "success", value: stats.students },
    { title: "إجمالي التسجيلات", icon: "assignment_turned_in", color: "warning", value: stats.enrollments },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {error && (
          <div style={{ color: "#d6336c", marginBottom: 12, fontWeight: 600 }}>
            {error}
          </div>
        )}
        <Grid container spacing={3}>
          {cards.map((card) => (
            <Grid item xs={12} md={6} lg={3} key={card.title}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color={card.color}
                  icon={card.icon}
                  title={card.title}
                  count={loading ? "..." : card.value}
                  percentage={{ color: "success", amount: "", label: loading ? "جاري التحميل" : "محدث" }}
                />
              </MDBox>
            </Grid>
          ))}
        </Grid>
        <MDBox mt={4}>
          <Card sx={{ overflow: "hidden", borderRadius: 3, border: "1px solid #eef1f4", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
            <MDBox p={2}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                الطلاب المسجلون في كورساتك
              </Typography>
              {studentRows.length === 0 && (
                <Typography color="text.secondary">
                  {loading ? "جاري التحميل..." : "لا يوجد طلاب مسجلون حالياً."}
                </Typography>
              )}
              {studentRows.length > 0 && (
                <MDBox display="grid" gap={1.5}>
                  {studentRows.map((row, idx) => (
                    <Card
                      key={row.id || idx}
                      sx={{
                        border: "1px solid #eef1f4",
                        borderRadius: 2,
                        boxShadow: "0 6px 16px rgba(0,0,0,0.04)",
                        padding: 1.5,
                      }}
                    >
                      <MDBox
                        display="grid"
                        gridTemplateColumns={{ xs: "repeat(2, minmax(0,1fr))", md: "repeat(4, minmax(0,1fr))" }}
                        gap={1.5}
                      >
                        <div>
                          <Typography variant="caption" color="text.secondary" display="block">
                            الطالب
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {row.studentName}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="caption" color="text.secondary" display="block">
                            البريد
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ direction: "ltr" }}>
                            {row.studentEmail}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="caption" color="text.secondary" display="block">
                            الكورس
                          </Typography>
                          <Chip
                            label={row.courseName}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600, mt: 0.5 }}
                          />
                        </div>
                        <div>
                          <Typography variant="caption" color="text.secondary" display="block">
                            تاريخ التسجيل
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {row.enrolledAt}
                          </Typography>
                        </div>
                      </MDBox>
                    </Card>
                  ))}
                </MDBox>
              )}
            </MDBox>
          </Card>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default TeacherDashboard;
