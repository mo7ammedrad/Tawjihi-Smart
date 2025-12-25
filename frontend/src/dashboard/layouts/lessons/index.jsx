import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import Icon from "@mui/material/Icon";
import { toast } from "react-toastify";

import Tables from "../tables";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import MDTypography from "../../components/MDTypography";
import { API_URL } from "../../../config";
import ConfirmDialog from "../../components/ConfirmDialog";

const API_HOST = API_URL.replace(/\/api\/v1$/, "");

const LessonsDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const teacherId = user?._id;

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    video: null,
    pdf: null,
    course: "",
  });
  const [confirm, setConfirm] = useState({ open: false, action: null, title: "", content: "" });
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/courses?teacher=${teacherId}`, { withCredentials: true });
      const docs = res?.data?.data?.docs || [];
      setCourses(docs);

      if (docs.length) {
        const courseId = selectedCourse || docs[0]._id;
        setSelectedCourse(courseId);
        setForm((prev) => ({ ...prev, course: courseId }));
      } else {
        setSelectedCourse("");
        setForm((prev) => ({ ...prev, course: "" }));
        toast.info("Add a course first to start uploading lessons.");
      }
    } catch (error) {
      toast.error("Failed to load courses");
    }
  };

  const fetchLessons = async (courseId) => {
    if (!courseId) {
      setLessons([]);
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/courses/${courseId}/lessons`, { withCredentials: true });
      const docs = res?.data?.data?.docs || [];
      setLessons(docs.map((lesson) => ({ ...lesson, course: lesson.course || courseId })));
    } catch (error) {
      toast.error("Failed to load lessons");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchLessons(selectedCourse);
    setForm((prev) => ({ ...prev, course: selectedCourse }));
  }, [selectedCourse]);

  const handleChangeForm = (key) => (event) => {
    const value = key === "video" || key === "pdf" ? event.target.files?.[0] : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openForCreate = () => {
    setEditingLesson(null);
    setForm({ name: "", description: "", video: null, pdf: null, course: selectedCourse });
    setOpenModal(true);
  };

const openForEdit = (lesson) => {
  setEditingLesson(lesson._id);
  setForm({
    name: lesson.name || "",
    description: lesson.description || "",
    video: null,
    pdf: null,
    course: lesson.course?._id || lesson.course || selectedCourse,
  });
  setOpenModal(true);
};

const handleCreateLesson = async () => {
  const courseId = form.course || selectedCourse;

  if (!form.name || !form.description || !form.video || !courseId) {
    toast.error("يرجى ملء جميع الحقول (العنوان، الوصف، الفيديو)، ويفضل إرفاق PDF.");
    return;
  }

  try {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("video", form.video); // ⬅️ مهم جداً
    formData.append("course", courseId);
    if (form.pdf) {
      formData.append("pdf", form.pdf);
    }

    const url = editingLesson
      ? `${API_URL}/courses/${courseId}/lessons/${editingLesson}`
      : `${API_URL}/courses/${courseId}/lessons`;
    const method = editingLesson ? "patch" : "post";

    await axios[method](url, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(editingLesson ? "تم تعديل الدرس بنجاح" : "تمت إضافة الدرس بنجاح");

    setOpenModal(false);
    setForm({
      name: "",
      description: "",
      video: null,
      pdf: null,
      course: courseId,
    });
    setEditingLesson(null);

    fetchLessons(courseId);
  } catch (error) {
    console.error(error);
    toast.error(
      error?.response?.data?.message || "حدث خطأ أثناء إضافة الدرس"
    );
  } finally {
    setIsSubmitting(false);
  }
};

  const confirmDeleteLesson = (lessonId) => {
    setConfirm({
      open: true,
      title: "Delete lesson",
      content: "Are you sure you want to delete this lesson?",
      action: async () => {
        try {
          setConfirmLoading(true);
          await axios.delete(`${API_URL}/courses/${selectedCourse}/lessons/${lessonId}`, {
            withCredentials: true,
          });
          setLessons((prev) => prev.filter((l) => l._id !== lessonId));
          toast.success("Lesson deleted");
        } catch (error) {
          toast.error("Could not delete lesson");
        } finally {
          setConfirmLoading(false);
          setConfirm({ open: false, action: null, title: "", content: "" });
        }
      },
    });
  };

  const columns = useMemo(
    () => [
      { id: "name", Header: "Name", accessor: "name", align: "center" },
      { id: "course", Header: "Course", accessor: "course", align: "center" },
      { id: "description", Header: "Description", accessor: "description", align: "center" },
      { id: "video", Header: "Video", accessor: "video", align: "center" },
      { id: "pdf", Header: "PDF", accessor: "pdf", align: "center" },
      { id: "duration", Header: "Duration (min)", accessor: "duration", align: "center" },
      { id: "createdAt", Header: "Created", accessor: "createdAt", align: "center" },
      { id: "action", Header: "Action", accessor: "action", align: "center" },
    ],
    [],
  );

  const courseLookup = useMemo(
    () =>
      courses.reduce((acc, course) => {
        acc[course._id] = course.name;
        return acc;
      }, {}),
    [courses],
  );

  const rows = useMemo(
    () =>
      lessons.map((lesson) => ({
        name: lesson.name,
        course: courseLookup[lesson.course?._id || lesson.course] || "-",
        description: (
          <div
            style={{
              maxWidth: 260,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
              margin: "0 auto",
            }}
            title={lesson.description}
          >
            {lesson.description}
          </div>
        ),
        video: lesson.video ? (
          <a
            href={
              lesson.video.startsWith("http")
                ? lesson.video
                : `${API_HOST}/api/v1${lesson.video.replace(/^\/api\/v1/, "")}`
            }
            target="_blank"
            rel="noreferrer"
            style={{ color: "#0d6efd", fontWeight: 700 }}
          >
            عرض الفيديو
          </a>
        ) : (
          "-"
        ),
        pdf: lesson.pdfUrl ? (
          <a
            href={
              lesson.pdfUrl.startsWith("http")
                ? lesson.pdfUrl
                : `${API_HOST}/api/v1${lesson.pdfUrl.replace(/^\/api\/v1/, "")}`
            }
            target="_blank"
            rel="noreferrer"
            style={{ color: "#0d6efd", fontWeight: 700 }}
            download
          >
            عرض الـ PDF
          </a>
        ) : (
          "-"
        ),
        duration: lesson.duration ? Math.round(lesson.duration / 60) : "-",
        createdAt: lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString() : "-",
        action: (
          <MDBox display="flex" justifyContent="center" gap={1}>
            <Icon
              fontSize="small"
              style={{ cursor: "pointer", color: "#0d6efd" }}
              onClick={() => openForEdit(lesson)}
            >
              edit
            </Icon>
            <MDTypography component="span" variant="caption" color="error" fontWeight="medium">
              <Icon
                fontSize="small"
                style={{ cursor: "pointer" }}
                onClick={() => confirmDeleteLesson(lesson._id)}
              >
                delete
              </Icon>
            </MDTypography>
          </MDBox>
        ),
      })),
    [lessons, courseLookup],
  );

  const loadingRows = useMemo(
    () =>
      isLoading
        ? [
            {
              name: "Loading...",
              course: "...",
              description: "...",
              duration: "...",
              createdAt: "...",
              action: "...",
            },
          ]
        : [],
    [isLoading],
  );

  const displayRows = isLoading ? loadingRows : rows;
  const isTeacher = user?.role === "teacher";

  return (
    <>
     <Tables tableTitle="Lessons" rows={displayRows} columns={columns}>
            {(isTeacher ) && (
              <Icon fontSize="large" style={{ cursor: "pointer" }} onClick={() => openForCreate()}>
                add_box
              </Icon>
            )}
          </Tables>

      <MDBox px={3} pb={1} display="flex" gap={2} alignItems="center" flexWrap="wrap">
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel id="course-select-label">Course</InputLabel>
          <Select
            labelId="course-select-label"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            input={<OutlinedInput label="Course" />}
          >
            {courses.map((course) => (
              <MenuItem key={course._id} value={course._id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </MDBox>



      <Dialog open={openModal} onClose={() => { setOpenModal(false); setEditingLesson(null); }} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 800, fontSize: 20, pb: 1.5, textAlign: "center" }}>
          {editingLesson ? "تعديل الدرس" : "إضافة درس"}
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: "#f7f9fc",
            pb: 2,
            "& .MuiFormLabel-root": { fontWeight: 700, color: "#243b53" },
            "& .MuiOutlinedInput-root": { background: "#fff" },
            direction: "rtl",
          }}
        >
          <MDBox
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
            gap={2}
            my={1.5}
            p={2.5}
            borderRadius="14px"
            border="1px solid #e0e6ed"
            bgcolor="white"
            boxShadow="0 10px 28px rgba(15, 23, 42, 0.08)"
          >
            <FormControl
              fullWidth
              size="small"
              sx={{
                "& .MuiInputBase-input": { fontSize: 16, fontWeight: 700, color: "#12212b" },
                "& .MuiInputLabel-root": { fontSize: 15 },
              }}
            >
              <InputLabel id="course-label">الكورس</InputLabel>
              <Select
              labelId="course-label"
              value={form.course}
              onChange={handleChangeForm("course")}
              input={<OutlinedInput label="الكورس" />}
              sx={{ direction: "rtl" }}
            >
              {courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.name}
                </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="عنوان الدرس"
              value={form.name}
              onChange={handleChangeForm("name")}
              fullWidth
              required
              size="small"
              InputProps={{ style: { fontSize: 16, fontWeight: 700, color: "#12212b" } }}
              InputLabelProps={{ style: { fontSize: 15 }, shrink: true }}
            />
            <TextField
              label="وصف الدرس"
              value={form.description}
              onChange={handleChangeForm("description")}
              fullWidth
              multiline
              minRows={2}
              required
              size="small"
              InputProps={{ style: { fontSize: 16, lineHeight: 1.6, fontWeight: 600, color: "#12212b" } }}
              InputLabelProps={{ style: { fontSize: 15 }, shrink: true }}
            />
            <TextField
              label="ملف الفيديو"
              type="file"
              inputProps={{ accept: "video/*" }}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  video: e.target.files[0],
                }))
              }
              fullWidth
              required
              size="small"
              InputLabelProps={{ style: { fontSize: 15 }, shrink: true }}
              helperText="ارفع فيديو الدرس (مطلوب)"
            />
            <TextField
              label="PDF (اختياري لمحتوى الدرس)"
              type="file"
              inputProps={{ accept: "application/pdf" }}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  pdf: e.target.files[0],
                }))
              }
              fullWidth
              size="small"
              InputLabelProps={{ style: { fontSize: 15 }, shrink: true }}
              helperText="اختياري: يسهّل التوليد عبر نص الـ PDF"
            />
          </MDBox>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: "space-between" }}>
          <MDButton color="secondary" variant="text" onClick={() => { setOpenModal(false); setEditingLesson(null); }} sx={{ fontWeight: 700 }}>
            إلغاء
          </MDButton>
          <MDButton
            color="info"
            onClick={handleCreateLesson}
            disabled={isSubmitting}
            sx={{
              fontWeight: 800,
              px: 3,
              minWidth: 140,
              py: 1,
            }}
          >
            {isSubmitting ? "جاري الحفظ..." : editingLesson ? "حفظ" : "إضافة"}
          </MDButton>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirm.open}
        loading={confirmLoading}
        title={confirm.title}
        content={confirm.content}
        confirmText="Delete"
        onClose={() => setConfirm({ open: false, action: null, title: "", content: "" })}
        onConfirm={() => confirm.action && confirm.action()}
      />
    </>
  );
};

export default LessonsDashboard;
