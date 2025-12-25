import { useState } from "react";
// style
import { StyledTeachersPage } from "./style";

// Api url
import { API_URL } from "../../config";

// Layouts
import { NavBar } from "../../layout/navBar";
import Footer from "../../layout/footer";

// Hooks
import { useApi } from "../../hooks/useApi";

// Components
import { LogoAndButton } from "../../components/LogoAndButton";
import { Containers } from "../../components/Container";
import { TeacherCard } from "../../components/card/teacherCard";
import Paginations from "../../components/paginations";
import FilterMenuItem from "../../components/MenuItem/FilterMenuItem";

//utils
import { paginate } from "../../utils/pagination";
import { WrapperCards } from "../Main/style";
import { SkeletonTeacherCard } from "../../components/Loading/SkeletonTeacherCard";

function Teachers() {
  const {
    data = [],
    isLoading,
    error,
  } = useApi(`${API_URL}/users/?role=teacher`);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Use paginate util
  const { currentItems, totalPages } = paginate(
    data,
    currentPage,
    itemsPerPage
  );

  return (
    <StyledTeachersPage>
      <LogoAndButton />
      <NavBar />

      <section>
        <Containers>
          <WrapperCards>
          <div className="num-of-pages">
            <FilterMenuItem
              currentPage={currentPage}
              totalPages={totalPages}
              order={false}
            />
          </div>
          <div className="teachers">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonTeacherCard key={i} />)
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : data.length === 0 ? (
              <p>.لا يوجد معلمين</p>
            ) : (
              <>
                {/* Teachers list */}
                <div className="teachers-list">
                  {currentItems.map((teacher, index) => (
                    <TeacherCard
                      key={teacher._id || index}
                      imgSrc={teacher.coverImage || "/assets/img/logo.png"}
                      name={teacher.name}
                      starIcon={teacher.averageRating}
                      id={teacher._id}
                    />
                  ))}
                </div>

                {/* Pagination buttons */}
                {totalPages > 1 && (
                  <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
          </WrapperCards>
        </Containers>
      </section>
      <Footer />
    </StyledTeachersPage>
  );
}

export default Teachers;
