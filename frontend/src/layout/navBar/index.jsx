//react
import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

//style
import { Nav } from "./style";

// components
import { LoginAndRegisterButton } from "../../components/loginButtonAndRegister";
import Hamburger from "../../components/humborgar";

//Paths
import { PATH } from "../../routes";
import { API_URL } from "../../config";

// context
import { ModalContext } from "../../context/ModalContext";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

export const NavBar = () => {
  const { theme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const { setIsOpen } = useContext(ModalContext);
  const location = useLocation();
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

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const { setIsAuth } = useContext(AuthContext);
  useEffect(() => {
    if (userRaw) {
      setIsAuth(true);
    }
  }, [userRaw, setIsAuth]);

  useEffect(() => {
    const fetchUnread = async () => {
      if (!parsedUser) return;
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

  return (
    <Nav className="navBar">
      <Hamburger isOpen={menuOpen} toggleMenu={toggleMenu} />
      <ul className={`navBarItems ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to={PATH.Main}>الرئيسية</Link>
        </li>
        <li>
          <Link to={`/${PATH.Courses}`}>الدورات</Link>
        </li>
        <li>
          <Link to={`/${PATH.About}`}>من نحن</Link>
        </li>
        <li>
          <Link to={`/${PATH.Contact}`}>تواصل معنا</Link>
        </li>
        <li>
          <Link to={`/${PATH.News}`}>آخر الأخبار</Link>
        </li>
        {parsedUser && parsedUser.role === "user" && location.pathname.includes("/courses/") && (
          <li>
            <a href="#lesson-quiz">اختبار الدرس</a>
          </li>
        )}
      </ul>

      <LoginAndRegisterButton onClick={() => setIsOpen(true)} color={`${theme.linearGradient}`} fontSize="18px">
        الانضمام كمعلم
      </LoginAndRegisterButton>
    </Nav>
  );
};
