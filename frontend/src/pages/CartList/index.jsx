//react
import { useEffect, useState } from "react";

//components
import { CourseCard } from "../../components/card/courseCard";
import { Containers } from "../../components/Container";

//axios
import axios from "axios";
//URL
import { API_URL } from "../../config";
import { LogoAndButton } from "../../components/LogoAndButton";
import { NavBar } from "../../layout/navBar";
import { ModalTeacher } from "../../components/modalTeacher";
import { CartHeader } from "../../components/cartHeader";

//toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginAndRegisterButton } from "../../components/loginButtonAndRegister";
import { CardSkeleton } from "../../components/Loading/LoadingCard";

const CartList = () => {
  // const { cart, setCartList } = useCRUD();
  const [cart, setCartList] = useState([]);

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_URL}/cart`, {
          withCredentials: true,
        });
        setCartList(res.data.cart.courses);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  const handlePayment = async () => {
    if (cart.length !== 0) {
      try {
        setPaymentLoading(true);

        const course_ids = cart.map((item) => item._id);
        const res = await axios.post(
          `${API_URL}/payment/create-checkout-session`,
          { ids: course_ids },
          {
            withCredentials: true,
          }
        );
        window.location.href = res.data.sessionUrl;
      } catch (e) {
        console.log(e);
      } finally {
        setPaymentLoading(false);
      }
    }
  };

  return (
    <div>
      <ToastContainer />

      <LogoAndButton />
      <NavBar />
      <ModalTeacher />

      <Containers>
        <CartHeader>
          <h2 style={{ textAlign: "center", margin: "16px" }}>قائمة السلة</h2>

          <LoginAndRegisterButton
            fontSize={18}
            onClick={handlePayment}
            isDisabled={paymentLoading || cart.length === 0}
          >
            {paymentLoading ? (
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span className="spinner" /> جاري المعالجة...
              </span>
            ) : (
              "شراء الكل"
            )}
          </LoginAndRegisterButton>
        </CartHeader>

        <div
          className="cart-grid"
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
          ) : cart.length === 0 ? (
            <p style={{ textAlign: "center", width: "100%" }}>لا توجد عناصر.</p>
          ) : (
            cart.map((item) => (
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
          )}
        </div>
      </Containers>
    </div>
  );
};

export default CartList;
