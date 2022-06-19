import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Page/home";
import Register from "./Page/register";
import Login from "./Page/login";
import Workspace from "./Page/workspace";
import Board from "./Page/board";
import { UserAuthContextProvider } from "./Library/UserAuthContext";
import ProtectedRoute from "./Library/ProtectedRoute";
import Profile from "./Page/profile";
import JoinWorkspaceForm from "./Component/JoinWorkspaceForm";

function App() {
  return (
    <BrowserRouter>
      <UserAuthContextProvider>
        <Routes>
          {/* <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home></Home>
              </ProtectedRoute>
            }
          /> */}
          <Route path="/home" element={<Home />} />
          <Route path="/signedIn" element={<Home />} />
          <Route path="/invite-link/:id" element={<JoinWorkspaceForm />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/workspace/:id" element={<Workspace />} />
          <Route path="/board/:id" element={<Board />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </UserAuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
