import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
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

const initialFormState = {
  name: "",
  description: "",
  price: "",
  priceAfterDiscount: "",
  subject: "",
  branches: [],
  coverImage: null,
  teacher: "",
};

const CoursesDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isTeacher = user?.role === "teacher";
  const isAdmin = user?.role === "admin";

  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formState, setFormState] = useState(initialFormState);
  const [confirm, setConfirm] = useState({ open: false, action: null, title: "", content: "" });
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchLookups = async () => {
    try {
      const [branchesRes, subjectsRes] = await Promise.all([
        axios.get(`${API_URL}/branches`),
        axios.get(`${API_URL}/subjects`),
      ]);

      setBranches(branchesRes?.data?.data?.docs || []);
      setSubjects(subjectsRes?.data?.data?.docs || []);
    } catch (error) {
      toast.error("Failed to load branches or subjects");
    }
  };

  const fetchTeachers = async () => {
    if (!isAdmin) return;
    try {
      const res = await axios.get(`${API_URL}/users?role=teacher&isActive=true`, {
        withCredentials: true,
      });
      setTeachers(res?.data?.data?.docs || []);
    } catch (error) {
      toast.error("Failed to load teachers");
    }
  };

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const teacherQuery = isTeacher && user?._id ? `?teacher=${user._id}` : "";
      const res = await axios.get(`${API_URL}/courses${teacherQuery}`, {
        withCredentials: true,
      });
      setCourses(res?.data?.data?.docs || []);
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLookups();
    fetchTeachers();
    fetchCourses();
  }, []);

  const handleChange = (key) => (event) => {
    const value = key === "coverImage" ? event.target.files?.[0] : event.target.value;
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormState(initialFormState);
    setEditingCourse(null);
  };

  const openForCreate = () => {
    resetForm();
    setOpenModal(true);
  };

  const openForEdit = (course) => {
    setEditingCourse(course._id);
    setFormState({
      name: course.name || "",
      description: course.description || "",
      price: course.price ?? "",
      priceAfterDiscount: course.priceAfterDiscount ?? "",
      subject: course.subject?._id || course.subject || "",
      branches: (course.branches || []).map((b) => b._id || b),
      coverImage: null,
      teacher: course.teacher?._id || course.teacher || "",
    });
    setOpenModal(true);
  };

  const handleCreateCourse = async () => {
    if (!formState.name || !formState.subject || !formState.branches.length || !formState.price) {
      toast.error("Please fill the required fields");
      return;
    }

    const teacherId = isAdmin ? formState.teacher : user?._id;
    if (!teacherId) {
      toast.error("Teacher is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("name", formState.name);
      if (formState.description.trim()) {
        payload.append("description", formState.description.trim());
      }
      payload.append("price", Number(formState.price));
      if (formState.priceAfterDiscount) {
        payload.append("priceAfterDiscount", Number(formState.priceAfterDiscount));
      }
      payload.append("subject", formState.subject);
      // send branches as a JSON string so backend can consistently parse it
      payload.append("branches", JSON.stringify(formState.branches));
      if (teacherId) payload.append("teacher", teacherId);
      if (formState.coverImage) payload.append("coverImage", formState.coverImage);

      const url = editingCourse ? `${API_URL}/courses/${editingCourse}` : `${API_URL}/courses`;
      const method = editingCourse ? "patch" : "post";

      const res = await axios[method](url, payload, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchCourses();
      toast.success(editingCourse ? "Course updated" : "Course created");
      setOpenModal(false);
      resetForm();
    } catch (error) {
      const msg = error?.response?.data?.message || "Could not save course";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteCourse = (courseId) => {
    setConfirm({
      open: true,
      title: "Delete course",
      content: "Are you sure you want to delete this course and its lessons?",
      action: async () => {
        try {
          setConfirmLoading(true);
          await axios.delete(`${API_URL}/courses/${courseId}`, { withCredentials: true });
          setCourses((prev) => prev.filter((course) => course._id !== courseId));
          toast.success("Course removed");
        } catch (error) {
          toast.error("Could not delete course");
        } finally {
          setConfirmLoading(false);
          setConfirm({ open: false, action: null, title: "", content: "" });
        }
      },
    });
  };

  const columns = useMemo(() => {
    const cols = [
      { id: "name", Header: "Name", accessor: "name", align: "center" },
      { id: "subject", Header: "Subject", accessor: "subject", align: "center" },
      { id: "branches", Header: "Branches", accessor: "branches", align: "center" },
      { id: "price", Header: "Price", accessor: "price", align: "center" },
      { id: "discount", Header: "Discounted Price", accessor: "discount", align: "center" },
    ];

    if (!isTeacher) {
      cols.splice(2, 0, { id: "teacher", Header: "Teacher", accessor: "teacher", align: "center" });
    }

    cols.push(
      { id: "createdAt", Header: "Created", accessor: "createdAt", align: "center" },
      { id: "action", Header: "Action", accessor: "action", align: "center" },
    );

    return cols;
  }, [isTeacher]);

  const rows = useMemo(() => {
    return courses.map((course) => ({
      name: course.name,
      subject: course.subject?.name || "-",
      branches: Array.isArray(course.branches)
        ? course.branches.map((branch) => branch?.name).filter(Boolean).join(", ")
        : "-",
      teacher: course.teacher?.name || "-",
      price: `$${course.price ?? 0}`,
      discount: course.priceAfterDiscount ? `$${course.priceAfterDiscount}` : "-",
      createdAt: course.createdAt ? new Date(course.createdAt).toLocaleDateString() : "-",
      action: (
        <MDBox display="flex" justifyContent="center" gap={1}>
          <Icon
            fontSize="small"
            style={{ cursor: "pointer", color: "#0d6efd" }}
            onClick={() => openForEdit(course)}
          >
            edit
          </Icon>
          <MDTypography component="span" variant="caption" color="error" fontWeight="medium">
            <Icon
              fontSize="small"
              style={{ cursor: "pointer" }}
              onClick={() => confirmDeleteCourse(course._id)}
            >
              delete
            </Icon>
          </MDTypography>
        </MDBox>
      ),
    }));
  }, [courses]);

  const loadingRows = useMemo(
    () =>
      isLoading
        ? [
            {
              name: "Loading...",
              subject: "...",
              branches: "...",
              teacher: "...",
              price: "...",
              discount: "...",
              createdAt: "...",
              action: "...",
            },
          ]
        : [],
    [isLoading],
  );

  const displayRows = isLoading ? loadingRows : rows;

  return (
    <>
      <Tables tableTitle="Courses" rows={displayRows} columns={columns}>
        {(isTeacher ) && (
          <Icon fontSize="large" style={{ cursor: "pointer" }} onClick={openForCreate}>
            add_box
          </Icon>
        )}
      </Tables>

      <Dialog open={openModal} onClose={() => { setOpenModal(false); resetForm(); }} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 800, fontSize: 20, pb: 1.5, textAlign: "center" }}>
          {editingCourse ? "Edit course" : "Add new course"}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#f7f9fc", pb: 2 }}>
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
            sx={{ "& .MuiFormLabel-root": { fontWeight: 700 }, "& .MuiOutlinedInput-root": { background: "#fff" } }}
          >
            <TextField
              label="Name"
              value={formState.name}
              onChange={handleChange("name")}
              fullWidth
              required
              size="small"
              InputProps={{ style: { fontSize: 16, fontWeight: 700 } }}
              InputLabelProps={{ style: { fontSize: 15 }, shrink: true }}
            />
            <TextField
              label="Price"
              type="number"
              value={formState.price}
              onChange={handleChange("price")}
              fullWidth
              required
              size="small"
              InputProps={{ style: { fontSize: 16, fontWeight: 700 } }}
              InputLabelProps={{ style: { fontSize: 15 }, shrink: true }}
            />
            <TextField
              label="Price after discount"
              type="number"
              value={formState.priceAfterDiscount}
              onChange={handleChange("priceAfterDiscount")}
              fullWidth
              size="small"
              InputProps={{ style: { fontSize: 16, fontWeight: 600 } }}
              InputLabelProps={{ style: { fontSize: 15 }, shrink: true }}
            />
            {isAdmin && (
              <FormControl fullWidth size="small">
                <InputLabel id="teacher-label">Teacher</InputLabel>
                <Select
                  labelId="teacher-label"
                  value={formState.teacher}
                  onChange={handleChange("teacher")}
                  input={<OutlinedInput label="Teacher" />}
                >
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <FormControl fullWidth size="small">
              <InputLabel id="subject-label">Subject</InputLabel>
              <Select
                labelId="subject-label"
                value={formState.subject}
                onChange={handleChange("subject")}
                input={<OutlinedInput label="Subject" />}
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject._id} value={subject._id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel id="branches-label">Branches</InputLabel>
              <Select
                multiple
                labelId="branches-label"
                value={formState.branches}
                onChange={handleChange("branches")}
                input={<OutlinedInput label="Branches" />}
                renderValue={(selected) =>
                  branches
                    .filter((branch) => selected.includes(branch._id))
                    .map((branch) => branch.name)
                    .join(", ")
                }
              >
                {branches.map((branch) => (
                  <MenuItem key={branch._id} value={branch._id}>
                    <Checkbox checked={formState.branches.indexOf(branch._id) > -1} />
                    <ListItemText primary={branch.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Description"
              value={formState.description}
              onChange={handleChange("description")}
              fullWidth
              multiline
              minRows={3}
              size="small"
              InputProps={{ style: { fontSize: 16, lineHeight: 1.6, fontWeight: 600 } }}
              InputLabelProps={{ style: { fontSize: 15 }, shrink: true }}
            />
            <TextField
              label="Cover image"
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={handleChange("coverImage")}
              fullWidth
              size="small"
              InputLabelProps={{ style: { fontSize: 15 }, shrink: true }}
            />
          </MDBox>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: "space-between" }}>
          <MDButton color="secondary" variant="text" onClick={() => { setOpenModal(false); resetForm(); }}>
            Cancel
          </MDButton>
          <MDButton
            color="info"
            onClick={handleCreateCourse}
            disabled={isSubmitting}
            sx={{ fontWeight: 800, px: 3, minWidth: 140, py: 1 }}
          >
            {isSubmitting ? "Saving..." : editingCourse ? "Save" : "Add"}
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

export default CoursesDashboard;
