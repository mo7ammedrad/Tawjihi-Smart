import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Loading from "./components/Loading";
import DashboardApp from "./dashboard/App";
import { MaterialUIControllerProvider } from "./dashboard/context";
import AiChatWidget from "./components/AiChatWidget";

function App() {
  let isStudent = false;
  try {
    const raw = localStorage.getItem("user");
    const parsed = raw ? JSON.parse(raw) : null;
    isStudent = parsed?.role === "user";
  } catch (e) {
    isStudent = false;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Outlet />
      {isStudent && <AiChatWidget />}
      
      {/* <MaterialUIControllerProvider>
        <DashboardApp />
      </MaterialUIControllerProvider> */}
    </Suspense>
  );
}

export default App;
