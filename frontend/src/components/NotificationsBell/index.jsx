import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import { useNotifications } from "../../hooks/useNotifications";

const emptyState = { opacity: 0.8, padding: "8px 16px", maxWidth: 320 };

export default function NotificationsBell({ enabled }) {
  const { notifications, unreadCount, markRead, markAllRead, loading } = useNotifications({
    enabled,
    pollMs: 30000,
    limit: 25,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const items = useMemo(() => notifications.slice(0, 10), [notifications]);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const onClickItem = async (n) => {
    try {
      if (!n.isRead) await markRead(n._id);
    } finally {
      handleClose();
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen} aria-label="notifications" sx={{ color: "var(--color-dark-bg)" }}>
        <Badge color="error" badgeContent={unreadCount} max={99}>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">الإشعارات</Typography>
        </MenuItem>
        <Divider />

        {!items.length ? (
          <div style={emptyState}>
            <Typography variant="body2">{loading ? "جاري التحميل..." : "لا توجد إشعارات حالياً"}</Typography>
          </div>
        ) : (
          items.map((n) => (
            <MenuItem
              key={n._id}
              onClick={() => onClickItem(n)}
              component={n.link ? RouterLink : "li"}
              to={n.link || undefined}
              sx={{ maxWidth: 340, whiteSpace: "normal", alignItems: "flex-start" }}
            >
              <ListItemText
                primaryTypographyProps={{ fontWeight: n.isRead ? 400 : 700 }}
                primary={n.title}
                secondary={n.body}
              />
            </MenuItem>
          ))
        )}

        <Divider />
        <MenuItem
          onClick={async () => {
            await markAllRead();
            handleClose();
          }}
          disabled={!unreadCount}
        >
          تحديد الكل كمقروء
        </MenuItem>
      </Menu>
    </>
  );
}
