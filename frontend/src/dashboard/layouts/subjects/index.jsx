import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import Icon from "@mui/material/Icon";
import { toast } from "react-toastify";

import Tables from "../tables";
import MDButton from "../../components/MDButton";
import MDTypography from "../../components/MDTypography";
import { API_URL } from "../../../config";
import MDBox from "../../components/MDBox";
import ConfirmDialog from "../../components/ConfirmDialog";

const SubjectsDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [confirm, setConfirm] = useState({ open: false, action: null, title: "", content: "" });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/subjects`, { withCredentials: true });
      setSubjects(res?.data?.data?.docs || []);
    } catch (error) {
      toast.error("Failed to load subjects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      const res = await axios.post(
        `${API_URL}/subjects`,
        { name: name.trim(), description: description.trim() },
        { withCredentials: true },
      );
      const created = res?.data?.data?.newDoc;
      if (created) {
        setSubjects((prev) => [created, ...prev]);
        toast.success("Subject created");
        closeModal();
      }
    } catch (error) {
      toast.error("Could not create subject");
    }
  };

  const handleUpdate = async () => {
    if (!editingSubject?._id || !name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      const res = await axios.patch(
        `${API_URL}/subjects/${editingSubject._id}`,
        { name: name.trim(), description: description.trim() },
        { withCredentials: true },
      );
      const updated = res?.data?.data?.updatedDoc || res?.data?.data?.doc;
      if (updated) {
        setSubjects((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
        toast.success("تم حفظ التعديلات بنجاح");
        closeModal();
      }
    } catch (error) {
      toast.error("تعذر حفظ التعديلات");
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingSubject(null);
    setName("");
    setDescription("");
  };

  const openCreateModal = () => {
    setEditingSubject(null);
    setName("");
    setDescription("");
    setOpenModal(true);
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);
    setName(subject.name || "");
    setDescription(subject.description || "");
    setOpenModal(true);
  };

  const handleSubmit = () => {
    if (editingSubject) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const confirmDelete = (id) => {
    setConfirm({
      open: true,
      title: "Delete subject",
      content: "Are you sure you want to delete this subject? This cannot be undone.",
      action: async () => {
        try {
          setConfirmLoading(true);
          await axios.delete(`${API_URL}/subjects/${id}`, { withCredentials: true });
          setSubjects((prev) => prev.filter((s) => s._id !== id));
          toast.success("Subject deleted");
        } catch (error) {
          toast.error("Could not delete subject");
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
      { id: "description", Header: "Description", accessor: "description", align: "center" },
      { id: "createdAt", Header: "Created", accessor: "createdAt", align: "center" },
      { id: "action", Header: "Action", accessor: "action", align: "center" },
    ],
    [],
  );

  const rows = useMemo(
    () =>
      subjects.map((subject) => ({
        name: subject.name,
        description: subject.description || "-",
        createdAt: subject.createdAt ? new Date(subject.createdAt).toLocaleDateString() : "-",
        action: (
          <MDBox display="flex" justifyContent="center" alignItems="center" gap={1.5}>
            <MDTypography component="span" variant="caption" color="info" fontWeight="medium">
              <Icon
                fontSize="small"
                style={{ cursor: "pointer" }}
                onClick={() => openEditModal(subject)}
              >
                edit
              </Icon>
            </MDTypography>
            <MDTypography component="span" variant="caption" color="error" fontWeight="medium">
              <Icon
                fontSize="small"
                style={{ cursor: "pointer" }}
                onClick={() => confirmDelete(subject._id)}
              >
                delete
              </Icon>
            </MDTypography>
          </MDBox>
        ),
      })),
    [subjects],
  );

  const loadingRows = useMemo(
    () =>
      isLoading
        ? [
            {
              name: "Loading...",
              description: "...",
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
      <Tables tableTitle="Subjects" rows={displayRows} columns={columns}>
        <IconButton onClick={openCreateModal}>
          <Icon fontSize="large">add_box</Icon>
        </IconButton>
      </Tables>

      <Dialog open={openModal} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>{editingSubject ? "Edit subject" : "Add subject"}</DialogTitle>
        <DialogContent sx={{ backgroundColor: "#f7f9fc" }}>
          <MDBox
            p={2}
            borderRadius="12px"
            border="1px solid #e0e6ed"
            bgcolor="white"
            boxShadow="0 6px 24px rgba(15, 23, 42, 0.06)"
          >
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              minRows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton color="secondary" variant="text" onClick={closeModal}>
            Cancel
          </MDButton>
          <MDButton color="info" onClick={handleSubmit}>
            {editingSubject ? "Save" : "Add"}
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

export default SubjectsDashboard;
