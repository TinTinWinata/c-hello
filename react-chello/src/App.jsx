import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Home from "./Page/home";
import Register from "./Page/register";
import Login from "./Page/login";
import Workspace from "./Page/workspace";
import Board from "./Page/board";
import { UserAuthContextProvider } from "./Library/UserAuthContext";
import ProtectedRoute from "./Library/ProtectedRoute";
import Profile from "./Page/profile";
import { ToastContainer } from "react-toastify";
import JoinWorkspaceForm from "./Component/JoinWorkspaceForm";
import "react-toastify/dist/ReactToastify.css";
import "quill/dist/quill.snow.css";
import BoardJoinForm from "./Component/BoardJoinForm";
import CardWithInvitedLink from "./Component/CardWithInvitedLink";
import DeleteWorkspaceForm from "./Component/DeleteWorkspaceForm";
import { HashRouter } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { Shortcut } from "./Script/Shortcut";
import ProfileUser from "./Component/ProfileUser";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer></ToastContainer>
      <UserAuthContextProvider>
        <Shortcut>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signedIn" element={<Home />} />
            <Route path="/invite-link/:id" element={<JoinWorkspaceForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/workspace/:id" element={<Workspace />} />
            <Route path="/board/:id" element={<Board />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<ProfileUser />} />
            <Route
              path="/card-invite-link/:id"
              element={<CardWithInvitedLink />}
            />
            <Route
              path="/board-invite-link/:id"
              element={<BoardJoinForm></BoardJoinForm>}
            />
            <Route
              path="/delete-workspace/:id"
              element={<DeleteWorkspaceForm></DeleteWorkspaceForm>}
            ></Route>
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Home></Home>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Shortcut>
      </UserAuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
