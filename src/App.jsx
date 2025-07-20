import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Signup from "./pages/Signup";
import Drive from "./pages/Drive";
import { FolderProvider } from "./context/FolderContext";
// import Drive from "./pages/Drive";

function App() {
  return (
    <BrowserRouter>
      <FolderProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/folder/my-folders/:folderId"
            element={
              <PrivateRoute>
                <Drive />
              </PrivateRoute>
            }
          />{" "}
          <Route
            path="/dashboard/folder/:folderId"
            element={
              <PrivateRoute>
                <Drive />
              </PrivateRoute>
            }
          />
        </Routes>
      </FolderProvider>
    </BrowserRouter>
  );
}

export default App;
