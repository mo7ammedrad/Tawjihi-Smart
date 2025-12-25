// react
import { useState, useMemo, useContext, useEffect } from "react";

// style
import { CoursesPageWraper } from "./style";

// layout components
import SideBar from "../../layout/sideBar";
import { NavBar } from "../../layout/navBar";

// components
import { LogoAndButton } from "../../components/LogoAndButton";
import { Containers } from "../../components/Container";
import FilterMenuItem from "../../components/MenuItem/FilterMenuItem";
import { CardSkeleton } from "../../components/Loading/LoadingCard";
import { CourseCard } from "../../components/card/courseCard";
import Paginations from "../../components/paginations";
import { ModalTeacher } from "../../components/modalTeacher";

// hooks
import { useApi } from "../../hooks/useApi";

// URL
import { API_URL } from "../../config";

// MUI Library
import { Typography } from "@mui/material";
import { WrapperCards } from "../Main/style";

// context
import { DataCourses } from "../../context/DataCourses";
import { NewOldContext } from "../../context/NewOldContext";
import { SearchContext } from "../../context/SearchContext";

// utils function
import { filterCourses } from "../../utils/filterCourses";
import { paginate } from "../../utils/pagination";
import { updateFilters } from "../../utils/handleFilterChange";

// toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Courses = () => {
  const {
    data: fetchedCourses = [],
    isLoading,
    error,
  } = useApi(`${API_URL}/courses/`);

  const { dataCourses, setDataCourses } = useContext(DataCourses);
  const { isNew } = useContext(NewOldContext);
  const { search, setSearch } = useContext(SearchContext);

  useEffect(() => {
    if (fetchedCourses.length > 0) {
      setDataCourses(fetchedCourses);
    }
  }, [fetchedCourses, setDataCourses]);

  const [filters, setFilters] = useState({
    names: [],
    branches: [],
    subjects: [],
    prices: [],
  });

  const courseNames = useMemo(() => {
    const names = dataCourses.map((course) => course.name);
    return [...new Set(names)];
  }, [dataCourses]);

  const handleFilterChange = (id, isChecked) => {
    setFilters((prev) => updateFilters(prev, id, isChecked));
    setSearch("");
  };

  const filteredCourses = useMemo(() => {
    return filterCourses(dataCourses, filters, search);
  }, [dataCourses, filters, search]);

  const finalCourses = useMemo(() => {
    return isNew === "new"
      ? [...filteredCourses]
      : [...filteredCourses].reverse();
  }, [filteredCourses, isNew]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { currentItems, totalPages } = paginate(
    finalCourses,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <ToastContainer />
      <ModalTeacher isopen="true" />
      <CoursesPageWraper>
        <div>
          <LogoAndButton />
          <NavBar />

          <Containers>
            <FilterMenuItem
              currentPage={currentPage}
              totalPages={totalPages}
              order={true}
            />

            <div style={{ display: "flex" }}>
              <SideBar
                courseNames={courseNames}
                onFilterChange={handleFilterChange}
              />

              <div style={{ width: "80%" }}>
                {isLoading ? (
                  <WrapperCards>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <CardSkeleton key={i} />
                    ))}
                  </WrapperCards>
                ) : error ? (
                  <Typography color="error">فشل تحميل الدورات</Typography>
                ) : finalCourses.length === 0 ? (
                  <Typography variant="body1">لا توجد دورات مطابقة.</Typography>
                ) : (
                  <WrapperCards>
                    {currentItems.map((item) => (
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
                    ))}
                  </WrapperCards>
                )}
              </div>
            </div>

            {totalPages > 1 && (
              <Paginations
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
          </Containers>
        </div>
      </CoursesPageWraper>
    </>
  );
};

export default Courses;
