/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useMemo, useState } from "react";

// react-router components
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

// @mui material components
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import { ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 React components
import MDBox from "./components/MDBox";

// Material Dashboard 2 React example components
import Configurator from "./examples/Configurator";
import Sidenav from "./examples/Sidenav";

// Material Dashboard 2 React themes
import theme from "./assets/theme";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "./assets/theme-dark";

// RTL plugins
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";


// Material Dashboard 2 React routes
import {adminRoutes, teacherRoutes} from "./routes"

// Material Dashboard 2 React contexts
import { setMiniSidenav, setOpenConfigurator, useMaterialUIController } from "./context";

// Images
import brandDark from "./assets/images/logo-ct-dark.png";
import brandWhite from "./assets/images/logo-ct.png";


import { MaterialUIControllerProvider } from "./context";
import { CacheProvider } from "@emotion/react";
import rtlCache from "./utils/rtlCache"; // <-- هذا يجب أن يكون موجودًا
import "./assets/style/custom-dashboard.css";




export default function DashboardApp( {children, role}) {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

 

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });


  return (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="Tawjihi Dashboard"
              routes={role === "admin" ? adminRoutes : teacherRoutes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />            
          </>
        )}

        {children}

        
      </ThemeProvider>
    </CacheProvider>
  );
}
