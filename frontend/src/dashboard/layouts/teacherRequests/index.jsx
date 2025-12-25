import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

import Tables from "../tables";
import MDBox from "../../components/MDBox";
import { API_URL } from "../../../config";

const TeacherRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const filesBaseUrl = API_URL.replace("/api/v1", "");

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/users?role=teacher&isActive=false`, {
        withCredentials: true,
      });
      setRequests(res?.data?.data?.docs || []);
    } catch (error) {
      toast.error("Failed to load teacher requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDecision = async (id, action) => {
    try {
      if (action === "accept") {
        await axios.patch(`${API_URL}/users/${id}/acceptTeacher`, {}, { withCredentials: true });
        toast.success("تم قبول الطلب وإضافة المعلم بنجاح");
      } else {
        await axios.delete(`${API_URL}/users/${id}/refuseTeacher`, { withCredentials: true });
        toast.success("تم رفض الطلب وحذفه");
      }

      setRequests((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error("تعذر معالجة الطلب");
    }
  };

  const columns = useMemo(
    () => [
      { id: "name", Header: "Name", accessor: "name", align: "center" },
      { id: "email", Header: "Email", accessor: "email", align: "center" },
      { id: "phone", Header: "Phone", accessor: "phone", align: "center" },
      { id: "cv", Header: "CV", accessor: "cv", align: "center" },
      { id: "createdAt", Header: "Requested At", accessor: "createdAt", align: "center" },
      { id: "actions", Header: "Actions", accessor: "actions", align: "center" },
    ],
    [],
  );

  const rows = useMemo(
    () =>
      requests.map((teacher) => ({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone || "-",
        cv: teacher.cv ? (
          <a href={`${filesBaseUrl}/${teacher.cv}`} target="_blank" rel="noreferrer">
            Download
          </a>
        ) : (
          "-"
        ),
        createdAt: teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : "-",
        actions: (
          <MDBox display="flex" justifyContent="center" gap={1}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleDecision(teacher._id, "accept")}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDecision(teacher._id, "refuse")}
            >
              Refuse
            </Button>
          </MDBox>
        ),
      })),
    [requests],
  );

  const loadingRows = useMemo(
    () =>
      isLoading
        ? [
            {
              name: "Loading...",
              email: "...",
              phone: "...",
              cv: "...",
              createdAt: "...",
              actions: "...",
            },
          ]
        : [],
    [isLoading],
  );

  const displayRows = isLoading ? loadingRows : rows;

  return <Tables tableTitle="Teacher Requests" rows={displayRows} columns={columns} />;
};

export default TeacherRequests;
