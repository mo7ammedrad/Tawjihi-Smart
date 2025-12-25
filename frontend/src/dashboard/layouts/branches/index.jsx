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

const BranchesDashboard = () => {
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [confirm, setConfirm] = useState({ open: false, action: null, title: "", content: "" });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/branches`, { withCredentials: true });
      setBranches(res?.data?.data?.docs || []);
    } catch (error) {
      toast.error("Failed to load branches");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      const res = await axios.post(
        `${API_URL}/branches`,
        { name: name.trim(), description: description.trim() },
        { withCredentials: true },
      );
      const created = res?.data?.data?.newDoc;
      if (created) {
        setBranches((prev) => [created, ...prev]);
        toast.success("Branch created");
        closeModal();
      }
    } catch (error) {
      toast.error("Could not create branch");
    }
  };

  const handleUpdate = async () => {
    if (!editingBranch?._id || !name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      const res = await axios.patch(
        `${API_URL}/branches/${editingBranch._id}`,
        { name: name.trim(), description: description.trim() },
        { withCredentials: true },
      );
      const updated = res?.data?.data?.updatedDoc || res?.data?.data?.doc;
      if (updated) {
        setBranches((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
        toast.success("تم حفظ التعديلات بنجاح");
        closeModal();
      }
    } catch (error) {
      toast.error("تعذر حفظ التعديلات");
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingBranch(null);
    setName("");
    setDescription("");
  };

  const openCreateModal = () => {
    setEditingBranch(null);
    setName("");
    setDescription("");
    setOpenModal(true);
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    setName(branch.name || "");
    setDescription(branch.description || "");
    setOpenModal(true);
  };

  const handleSubmit = () => {
    if (editingBranch) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const confirmDelete = (id) => {
    setConfirm({
      open: true,
      title: "Delete branch",
      content: "Are you sure you want to delete this branch? This cannot be undone.",
      action: async () => {
        try {
          setConfirmLoading(true);
          await axios.delete(`${API_URL}/branches/${id}`, { withCredentials: true });
          setBranches((prev) => prev.filter((b) => b._id !== id));
          toast.success("Branch deleted");
        } catch (error) {
          toast.error("Could not delete branch");
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
      branches.map((branch) => ({
        name: branch.name,
        description: branch.description || "-",
        createdAt: branch.createdAt ? new Date(branch.createdAt).toLocaleDateString() : "-",
        action: (
          <MDBox display="flex" justifyContent="center" alignItems="center" gap={1.5}>
            <MDTypography component="span" variant="caption" color="info" fontWeight="medium">
              <Icon
                fontSize="small"
                style={{ cursor: "pointer" }}
                onClick={() => openEditModal(branch)}
              >
                edit
              </Icon>
            </MDTypography>
            <MDTypography component="span" variant="caption" color="error" fontWeight="medium">
              <Icon
                fontSize="small"
                style={{ cursor: "pointer" }}
                onClick={() => confirmDelete(branch._id)}
              >
                delete
              </Icon>
            </MDTypography>
          </MDBox>
        ),
      })),
    [branches],
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
      <Tables tableTitle="Branches" rows={displayRows} columns={columns}>
        <IconButton onClick={openCreateModal}>
          <Icon fontSize="large">add_box</Icon>
        </IconButton>
      </Tables>

      <Dialog open={openModal} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>{editingBranch ? "Edit branch" : "Add branch"}</DialogTitle>
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
            {editingBranch ? "Save" : "Add"}
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

export default BranchesDashboard;
