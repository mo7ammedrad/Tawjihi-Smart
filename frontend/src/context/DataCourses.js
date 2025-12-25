//react
import { createContext, useState } from "react";

export const DataCourses = createContext();

export const DataCoursesProvider = ({ children }) => {

  // Global Data
  const [dataCourses, setDataCourses] = useState([]);

  return (
    // Provider Context
    <DataCourses.Provider value={{ dataCourses, setDataCourses }}>
      {children}
    </DataCourses.Provider>
  );
};
