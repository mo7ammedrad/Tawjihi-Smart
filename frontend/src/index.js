import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import './index.css';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './global/GlobalStyle';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./utils/axiosSetup";

// Contexts
import { ThemeContextProvider, ThemeContext } from './context/ThemeContext';
import { ModalProvider } from './context/ModalContext';
import { AuthProvider } from './context/AuthContext';
import { LogOutProvider } from './context/LogoutContext';
import { DataCoursesProvider } from './context/DataCourses';
import { NewOldProvider } from './context/NewOldContext';
import { SearchContextProvider } from './context/SearchContext';
import { SideBarContextProvider } from './context/SideBarContext';
import { AppProvider } from './context/WishAndCartListContext';
import { CommentsProvider } from './context/CommentContext';

import { routers } from './routes';
import { MaterialUIControllerProvider } from './dashboard/context';

import { Provider } from 'react-redux';
import store from './dashboard/redux/store';


const router = createBrowserRouter(routers);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeContextProvider>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <ModalProvider>
              <SideBarContextProvider>
                <AuthProvider>
                  <LogOutProvider>
                    <DataCoursesProvider>
                      <NewOldProvider>
                        <SearchContextProvider>
                          <AppProvider>
                            <ToastContainer
                              position="center"
                              autoClose={3000}
                              hideProgressBar={false}
                              newestOnTop={false}
                              closeOnClick
                              rtl={true}
                              pauseOnFocusLoss
                              draggable
                              pauseOnHover
                            />
                            <CommentsProvider>
                              <MaterialUIControllerProvider>
                                <Provider store={store}>

                                <RouterProvider router={router} />

                                </Provider>
                              </MaterialUIControllerProvider>
                            </CommentsProvider>
                          </AppProvider>
                        </SearchContextProvider>
                      </NewOldProvider>
                    </DataCoursesProvider>
                  </LogOutProvider>
                </AuthProvider>
              </SideBarContextProvider>
            </ModalProvider>
          </ThemeProvider>
        )}
      </ThemeContext.Consumer>
    </ThemeContextProvider>
  </React.StrictMode>
);
