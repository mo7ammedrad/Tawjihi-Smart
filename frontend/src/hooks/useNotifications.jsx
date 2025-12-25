import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../config";

const STORAGE_KEY = "notifications:lastSeenAt";

const readLastSeen = () => {
  const value = localStorage.getItem(STORAGE_KEY);
  return value ? new Date(value) : null;
};

const writeLastSeen = (date) => {
  if (!date) return;
  localStorage.setItem(STORAGE_KEY, new Date(date).toISOString());
};

export const useNotifications = ({ enabled, pollMs = 30000, limit = 30 } = {}) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initializedRef = useRef(false);
  const erroredOnceRef = useRef(false);

  const fetchNotifications = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_URL}/notifications/me?limit=${limit}`, {
        withCredentials: true,
      });
      const docs = res?.data?.data?.docs || [];
      const count = res?.data?.data?.unreadCount ?? 0;

      setNotifications(docs);
      setUnreadCount(count);

      const newestCreatedAt = docs[0]?.createdAt;
      if (!newestCreatedAt) return;

      if (!initializedRef.current) {
        initializedRef.current = true;
        writeLastSeen(newestCreatedAt);
        return;
      }

      const lastSeenAt = readLastSeen();
      const newOnes = lastSeenAt
        ? docs.filter((n) => !n.isRead && new Date(n.createdAt) > lastSeenAt)
        : [];

      if (newOnes.length) {
        newOnes
          .slice(0, 3)
          .reverse()
          .forEach((n) => {
            toast.info(n.title || "إشعار جديد");
          });
        writeLastSeen(newestCreatedAt);
      }
    } catch (e) {
      const msg = e?.response?.data?.message || "تعذر تحميل الإشعارات";
      setError(msg);
      if (!erroredOnceRef.current) {
        erroredOnceRef.current = true;
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [enabled, limit]);

  useEffect(() => {
    if (!enabled) return;
    fetchNotifications();
  }, [enabled, fetchNotifications]);

  useEffect(() => {
    if (!enabled) return undefined;
    const id = setInterval(fetchNotifications, pollMs);
    return () => clearInterval(id);
  }, [enabled, pollMs, fetchNotifications]);

  const markRead = useCallback(
    async (id) => {
      await axios.patch(`${API_URL}/notifications/${id}/read`, {}, { withCredentials: true });
      await fetchNotifications();
    },
    [fetchNotifications]
  );

  const markAllRead = useCallback(async () => {
    await axios.patch(`${API_URL}/notifications/me/read-all`, {}, { withCredentials: true });
    await fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh: fetchNotifications,
    markRead,
    markAllRead,
  };
};
