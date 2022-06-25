import LoginForm from "../Component/LoginForm";
import Navbar from "../Component/Navbar";
import { useUserAuth } from "../Library/UserAuthContext";
import Home from "./home";

function Login() {
  const { user } = useUserAuth();

  if (user) {
    return <Home></Home>;a
  }

  return (
    <>
      <div className="relative w-screen h-screen bg-gray-100"></div>
      <LoginForm></LoginForm>
    </>
  );
}

export default Login;
