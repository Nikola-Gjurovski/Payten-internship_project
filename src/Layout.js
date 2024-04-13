import React from "react";
import { Link, Outlet,NavLink } from "react-router-dom";

const Layout = () => {
  return (
    <div className="App container">
      {/* <h3 className="d-flex justify-content-center m-3">Payten Internship</h3> */}
      <div className="d-flex justify-content-center mb-5 mt-4" >
        <img src="/download.png" alt="Descriptive Alt Text" className="img-fluid" />
      </div>

      <nav className="navbar navbar-expand-sm bg-light navbar-dark">
        <div className="container-fluid justify-content-center">
        <ul className="navbar-nav">
          <li className="nav-item m-1">
            <NavLink className={ ({isActive})=>isActive?"btn btn-primary":"btn btn-light btn-outline-primary"} to="/home">
              User
            </NavLink>
          </li>
          <li className="nav-item m-1">
            <NavLink className={({isActive})=>isActive?"btn btn-primary":"btn btn-light btn-outline-primary" }to="/project">
              Project
            </NavLink>
          </li>
          {/* <li className="nav-item m-1">
            <Link className="btn btn-light btn-outline-primary" to="/version">
              Version
            </Link>
          </li> */}
        </ul>
        </div>
      </nav>
      {/* <div className="d-flex justify-content-center">
        <img src="download.png" alt="Descriptive Alt Text" className="img-fluid" />
      </div> */}
      <Outlet />
    </div>
  );
};

export default Layout;
