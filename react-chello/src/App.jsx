import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Home from './Page/home';
import Register from './Page/register';
import Login from './Page/login';
import Workspace from './Page/workspace';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/workspace/:id" render={(props) => <Workspace {...props} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


