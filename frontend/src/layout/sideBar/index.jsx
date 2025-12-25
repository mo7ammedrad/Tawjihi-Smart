import { useContext, useEffect } from "react";
import {
  SidebarContainer,
  SidebarHeader,
  CheckSection,
  FilterCard,
  FilterTitle,
  LoadingText,
  ToggleButton,
  ToggleButtonWrapper,
  ModalOverlay,
  SidebarContent,
  HeaderBadge,
  FilterIcon,
  SidebarFooter,
  CloseButton,
  HeaderContent,
} from "./style";
import { CheckAndLabel } from "../../components/CheckAndLable";
import { SideBarContext } from "../../context/SideBarContext";
import { SearchContext } from "../../context/SearchContext";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { API_URL } from "../../config";
import { useApi } from "../../hooks/useApi";
import { normalizeArabic } from "../../utils/normlizeArabic";

const Sidebar = ({ onFilterChange }) => {
  const { search } = useContext(SearchContext);
  const normalizedSearch = normalizeArabic(search?.toLowerCase() || "");

  let { data: subject, isLoading } = useApi(`${API_URL}/subjects`);
  subject = subject.map((item) => item.name);

  let { data: branch } = useApi(`${API_URL}/branches`);
  branch = branch.map((item) => item.name);

  const allInputs = [
    branch.map((label) => ({
      id: `branch-${normalizeArabic(label)}`,
      label: `${label}`,
    })),
    subject.map((label) => ({ id: `subject-${label}`, label })),
    ...["free", "50", "100", "200", "500"].map((price) => ({
      id: `price-${price}`,
      label: price === "free" ? "مجاني" : price,
    })),
  ];

  useEffect(() => {
    allInputs.forEach(({ id, label }) => {
      if (
        normalizedSearch &&
        normalizeArabic(label).includes(normalizedSearch)
      ) {
        onFilterChange(id, true);
      }
    });
  }, [normalizedSearch]);

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    onFilterChange(id, checked);
  };

  const isMatched = (label) =>
    normalizedSearch &&
    normalizeArabic(label.toLowerCase()).includes(normalizedSearch);

  const { isOpen, setIsOpen } = useContext(SideBarContext);
  const onCancel = () => setIsOpen(false);

  return (
    <>
      <ToggleButtonWrapper isOpen={isOpen}>
        <ToggleButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen}>
          <FilterListIcon />
        </ToggleButton>
      </ToggleButtonWrapper>

      {isOpen && <ModalOverlay onClick={onCancel} />}

      <SidebarContainer isOpen={isOpen}>
        <SidebarContent>
          <SidebarHeader>
            <HeaderContent>
              <FilterIcon>
                <FilterListIcon />
              </FilterIcon>
              <div>
                <h2>المرشحات</h2>
                <HeaderBadge>تصفية النتائج</HeaderBadge>
              </div>
            </HeaderContent>
            <CloseButton onClick={onCancel}>
              <CloseIcon />
            </CloseButton>
          </SidebarHeader>

          <FilterCard>
            <FilterTitle>
              <span className="title-text">الأفرع الدراسية</span>
              <span className="title-count">{branch.length}</span>
            </FilterTitle>
            {isLoading ? (
              <LoadingText>
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                جاري التحميل...
              </LoadingText>
            ) : (
              <CheckSection>
                {branch.map((label) => (
                  <CheckAndLabel
                    key={label}
                    text={label}
                    id={`branch-${normalizeArabic(label)}`}
                    onChange={handleCheckboxChange}
                    defaultChecked={isMatched(label)}
                  />
                ))}
              </CheckSection>
            )}
          </FilterCard>

          <FilterCard>
            <FilterTitle>
              <span className="title-text">المواد الدراسية</span>
              <span className="title-count">{subject.length}</span>
            </FilterTitle>
            {isLoading ? (
              <LoadingText>
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                جاري التحميل...
              </LoadingText>
            ) : (
              <CheckSection>
                {subject.map((label) => (
                  <CheckAndLabel
                    key={label}
                    text={label}
                    id={`subject-${label}`}
                    onChange={handleCheckboxChange}
                    defaultChecked={isMatched(label)}
                  />
                ))}
              </CheckSection>
            )}
          </FilterCard>

          <FilterCard>
            <FilterTitle>
              <span className="title-text">نطاق الأسعار</span>
              <span className="title-count">5</span>
            </FilterTitle>
            <CheckSection>
              {[
                { id: "price-free", label: "مجاني" },
                { id: "price-50", label: "أقل من 50" },
                { id: "price-100", label: "أقل من 100" },
                { id: "price-200", label: "أقل من 200" },
                { id: "price-500", label: "أقل من 500" },
              ].map(({ id, label }) => (
                <CheckAndLabel
                  key={id}
                  text={label}
                  id={id}
                  onChange={handleCheckboxChange}
                  defaultChecked={isMatched(label)}
                />
              ))}
            </CheckSection>
          </FilterCard>

          <SidebarFooter>
            <p>تم العثور على النتائج المطابقة لمعايير البحث</p>
          </SidebarFooter>
        </SidebarContent>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
