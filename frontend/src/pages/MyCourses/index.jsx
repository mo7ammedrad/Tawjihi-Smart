//react
import { useEffect, useState } from "react";

//components
import { CourseCard } from "../../components/card/courseCard";

//axios
import axios from "axios";
//URL
import { API_URL } from "../../config";
import { LogoAndButton } from "../../components/LogoAndButton";
import { NavBar } from "../../layout/navBar";
//MUI library

//toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Containers } from "../../components/Container";
import { CardSkeleton } from "../../components/Loading/LoadingCard";

const MyCourses = () => {
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?._id;

  const [myCourses, setMyCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log("myCourses:", myCourses);

  useEffect(() => {
    const getData = async () => {
      if (!userId) {
        setMyCourses([]);
        return;
      }
      try {
        setIsLoading(true);
        // If Stripe redirected with a session_id, try to confirm the session on the server
        const sessionId = new URLSearchParams(window.location.search).get('session_id');
        if (sessionId) {
          try {
            // call confirm endpoint (public) to create payment/enrollments if webhook didn't run
            await axios.get(`${API_URL}/payment/confirm`, { params: { session_id: sessionId } });
          } catch (confirmErr) {
            console.warn('confirm session failed', confirmErr?.response?.data || confirmErr.message);
            // continue to fetch enrollments anyway
          }
        }
        const res = await axios.get(`${API_URL}/enrollments?user=${userId}`, {
          withCredentials: true,
        });

        if (res) {
          setMyCourses(res.data.data.docs);
        }

      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }

    };
    getData();
  }, []);

  return (
    <div>
      <ToastContainer />

      <LogoAndButton />
      <NavBar />
      <Containers>
        <h2 style={{ textAlign: "center", margin: "16px" }}>قائمة دوراتي</h2>

        <div
          className="myCourses-grid"
          style={{ display: "flex", flexWrap: "wrap" }}
        >

          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)

          ) : myCourses.length === 0 ? (
            <p style={{ textAlign: "center", width: "100%" }}>لا توجد عناصر.</p>
            
          ) : (
            (myCourses || [])
              .filter((item) => item?.course)
              .map((item) => {
                const { course } = item;
                const branches = course?.branches?.length
                  ? course.branches.map((b) => b?.name).filter(Boolean).join(" | ")
                  : "";

                return (
                  <CourseCard
                    key={course._id || item._id}
                    item={course}
                    id={course._id || item._id}
                    imgSrc={course?.img || "/assets/img/logo.png"}
                    name={course?.name || "Course"}
                    starIcon={course?.averageRating}
                    price={course?.price}
                    priceAfterDiscount={course?.priceAfterDiscount}
                    teacherName={course?.teacher?.name}
                    teacherImg={course?.teacher?.img || "/assets/img/logo.png"}
                    branch={branches}
                    subject={course?.subject?.name}
                  />
                );
              })
          )
          }

        </div>
        
      </Containers>
    </div>
  );
};

export default MyCourses;
