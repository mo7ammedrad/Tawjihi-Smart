//react
import { useEffect, useState } from "react";

//hooks
import { useCRUD } from "../../hooks/useCRUD";

//components
import {CourseCard } from "../../components/card/courseCard";
import { Containers } from "../../components/Container";

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
import { CardSkeleton } from "../../components/Loading/LoadingCard";

const WishList = () => {
  const { wishlist, setWishList } = useCRUD(); // ✅ استخدم wishList الصحيح
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get(`${API_URL}/wishlist`, {
          withCredentials: true,
        });
        setWishList(res.data.wishlist);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false)
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

        <h2 style={{ textAlign: "center", margin: "16px" }}>قائمة المفضلة</h2>

        <div
          className="wishlist-grid"
          style={{ display: "flex", flexWrap: "wrap" }}
        >

          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)

          ) : wishlist.length === 0 ? (
            <p style={{ textAlign: "center" , width: "100%" }}>لا توجد عناصر.</p>

          ) : (
            wishlist.map((item) => (
              <CourseCard
                key={item._id}
                item={item}
                id={item._id}
                imgSrc={item.img || "/assets/img/logo.png"}
                name={item.name}
                starIcon={item.averageRating}
                price={item.price}
                priceAfterDiscount={item.priceAfterDiscount}
                teacherName={item.teacher?.name}
                teacherImg={item.teacher?.img || "/assets/img/logo.png"}
                branch={item.branches.map((b) => b.name).join(" | ")}
                subject={item.subject?.name}
              />
            ))
          )
          }
        </div>

      </Containers>
    </div>
  );
};

export default WishList;
