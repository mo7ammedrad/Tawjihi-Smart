import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Tables from "../tables";
import { API_URL } from "../../../config";
import { toast } from "react-toastify";

const PaymentsDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/payment`, { withCredentials: true });
      setPayments(res?.data?.data?.docs || []);
    } catch (error) {
      toast.error("فشل تحميل المدفوعات");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const columns = useMemo(
    () => [
      { id: "user", Header: "User", accessor: "user", align: "center" },
      { id: "amount", Header: "Amount", accessor: "amount", align: "center" },
      { id: "createdAt", Header: "Created", accessor: "createdAt", align: "center" },
    ],
    [],
  );

  const rows = useMemo(
    () =>
      payments.map((payment) => ({
        user: payment.user || "-",
        amount: payment.amount ?? "-",
        createdAt: payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "-",
      })),
    [payments],
  );

  const loadingRows = useMemo(
    () =>
      isLoading
        ? [
            {
              user: "Loading...",
              amount: "...",
              createdAt: "...",
            },
          ]
        : [],
    [isLoading],
  );

  const displayRows = isLoading ? loadingRows : rows;

  return <Tables tableTitle="Payments" rows={displayRows} columns={columns} />;
};

export default PaymentsDashboard;
