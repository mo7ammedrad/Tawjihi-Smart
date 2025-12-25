//react
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Style
import {
  WrapperSearch,
  InputBar,
  SvgICon,
  SuggestionBox,
  SuggestionItem,
} from "./style";

// Context
import { SearchContext } from "../../context/SearchContext";

// Routes
import { PATH } from "../../routes";

// Sample static data (replace with API if needed)
const allCourses = [
  "الكيمياء",
  "الفيزياء",
  "الرياضيات",
  "اللغة العربية",
  "اللغة الإنجليزية",
  "العلوم الحياتية",
  "العلوم العامة",
  "التاريخ",
  "البرمجة الأساسية",
];

const SearchBar = () => {
  const navigate = useNavigate();
  const { search, setSearch } = useContext(SearchContext);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length > 1) {
      const filtered = allCourses.filter((course) =>
        course.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSearch = () => {
    if (search.trim() !== "") {
      navigate(`/${PATH.Courses}`);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (value) => {
    setSearch(value);
    setShowSuggestions(false);
    navigate(`/${PATH.Courses}`);
  };

  return (
    <WrapperSearch style={{ position: "relative" }}>
      <InputBar
        type="text"
        value={search}
        placeholder="ابحث عن الدورة"
        onChange={handleChange}
        onFocus={() => search && setShowSuggestions(true)}
        onClick={() => setTimeout(() => setShowSuggestions(false), 150)}
      />

      <SvgICon
        className="iconBar"
        focusable="false"
        viewBox="0 0 24 24"
        tabIndex="-1"
        title="Search"
        onClick={handleSearch}
      >
        <path
          fill="${props => props.theme.checkBorder};
"
          d="M15.5 14h-.79l-.28-.27C15.41 12.59 
          16 11.11 16 9.5 16 5.91 13.09 3 
          9.5 3S3 5.91 3 9.5 5.91 16 
          9.5 16c1.61 0 3.09-.59 
          4.23-1.57l.27.28v.79l5 4.99L20.49 
          19zm-6 0C7.01 14 5 11.99 
          5 9.5S7.01 5 9.5 5 
          14 7.01 14 9.5 11.99 14 9.5 14"
        />
      </SvgICon>

      {showSuggestions && suggestions.length > 0 && (
        <SuggestionBox>
          {suggestions.map((s, index) => (
            <SuggestionItem
              key={index}
              onClick={() => handleSelectSuggestion(s)}
            >
              {s}
            </SuggestionItem>
          ))}
        </SuggestionBox>
      )}
    </WrapperSearch>
  );
};

export default SearchBar;
