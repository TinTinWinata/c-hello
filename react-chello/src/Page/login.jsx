import LoginForm from "../Component/LoginForm";
import Navbar from "../Component/Navbar";


function Login() {
  return (
  <>
      <Navbar></Navbar>
      <div className="relative border border-sky-500 w-50 h-screen">
      <LoginForm></LoginForm>
      </div>
  </>
  );
}

export default Login;
