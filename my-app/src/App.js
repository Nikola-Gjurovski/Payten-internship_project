import logo from "./logo.svg";
import "./App.css";
import { Home } from "./Home";
import { Project } from "./Project";
import  {Version}  from "./Version";
import VersionsProject from "./VersionsProject";
import AllUser from "./AllUser";
// import { Layout } from "./Layout";
import Layout from "./Layout";
import {
  BrowserRouter,
  Route,
  Switch,
  NavLink,
  Routes,
  Link,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home/>}/>
        <Route path="home" element={<Home />} />
        <Route path="project" element={<Project />} />
        <Route path="version" element={<Version/>}></Route>
        <Route path="version/:projectIdFromParams" element={<VersionsProject />} />
        <Route path="userproject/:projectIdFromParams" element={<AllUser />} />
       
      </Route>
     


      {/* <Route path="/version/:projectIdFromParams" element={<VersionsProject />} /> */}
 
    </Routes>
    
   
  </BrowserRouter>
  );
}

export default App;
