//react
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//axios
import axios from "axios";

//Path
import { PATH } from "../../routes/";

//URL
import { API_URL } from "../../config";

//context
import { AuthContext } from "../../context/AuthContext";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { setIsAuth } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`${API_URL}/users/me`, { withCredentials: true }) //withCredentials to cookies
      .then((response) => {
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          // setIsAuth(true);
        }
        navigate(PATH.Main);
      })
      .catch((error) => {
        console.error("error:", error);
        setIsAuth(false);
        navigate(`/${PATH.Auth}/login`);
      })
      .finally(() => setLoading(false));
  }, [navigate, setIsAuth]);

  if (loading) return <div>يتم الان التحويل علي الصفحة الرئيسية...</div>;
};

export default OAuthSuccess;
