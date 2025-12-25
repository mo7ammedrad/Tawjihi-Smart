import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

//style
import { WrapperNav } from "../../styles/style";

//components
import { Logo } from "../logo";
import { LoginAndRegisterButton } from "../loginButtonAndRegister";
import CustomizedMenus from "../MenuItem/MenuItem";

//Path
import { PATH } from "../../routes";

//context
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import { API_URL } from "../../config";

//MUI Library
import IconButton from "@mui/material/IconButton";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import NotificationsBell from "../NotificationsBell";
import MailIcon from "@mui/icons-material/Mail";
import Badge from "@mui/material/Badge";

export const LogoAndButton = () => {
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const [unread, setUnread] = useState(0);
  const userRaw = useMemo(() => {
    try {
      return localStorage.getItem("user");
    } catch (e) {
      return null;
    }
  }, []);
  const parsedUser = useMemo(() => {
    try {
      return userRaw ? JSON.parse(userRaw) : null;
    } catch (e) {
      return null;
    }
  }, [userRaw]);

  useEffect(() => {
    if (userRaw) {
      setIsAuth(true);
    }
  }, [setIsAuth, userRaw]);

  useEffect(() => {
    const fetchUnread = async () => {
      if (!parsedUser || parsedUser.role !== "user") return;
      try {
        const res = await fetch(`${API_URL}/messages/inbox?unreadCount=true`, { credentials: "include" });
        const data = await res.json();
        if (typeof data.unread === "number") setUnread(data.unread);
      } catch (e) {
        setUnread(0);
      }
    };
    fetchUnread();
  }, [parsedUser]);

  const { toggleTheme, theme } = useContext(ThemeContext);

  return (
    <WrapperNav>
      <Logo />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isAuth ? <NotificationsBell enabled={isAuth} /> : null}

        {parsedUser?.role === "user" && (
          <Link to="/user/inbox" aria-label="الرسائل" style={{ color: "inherit" }}>
            <IconButton sx={{ color: "var(--color-dark-bg)" }}>
              <Badge color="error" badgeContent={unread || 0}>
                <MailIcon />
              </Badge>
            </IconButton>
          </Link>
        )}

        <IconButton sx={{ color: "var(--color-dark-bg)" }} onClick={toggleTheme} aria-label="toggle theme">
          {theme.mode === "dark" ? (
            <WbSunnyIcon style={{ color: "var(--color-dark-text)" }} />
          ) : (
            <NightsStayIcon />
          )}
        </IconButton>

        {isAuth ? (
          <CustomizedMenus />
        ) : (
          <LoginAndRegisterButton>
            <Link to={`/${PATH.Auth}`}>التسجيل وتسجيل الدخول</Link>
          </LoginAndRegisterButton>
        )}
      </div>
    </WrapperNav>
  );
};
