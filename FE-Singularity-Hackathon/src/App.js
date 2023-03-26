import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ImagesUpload from "./components/ImagesUpload";

function App() {
  return (
    <div className="container">
      <nav
        class="navbar navbar-preview fixed-top"
        style={{
          background:
            "linear-gradient(90deg, rgba(220,219,235,1) 40%, rgba(0,0,0,1) 100%, rgba(0,212,255,1) 100%)",
        }}
      >
        <div class="container-fluid d-flex justify-content-between align-items-center w-100">
          <ul class="nav nav-preview d-none d-md-flex" role="tablist">
            <li class="nav-item">
              <div
                style={{
                  color: "black",
                  "font-size": "39px",
                  "font-family": "cursive",
                }}
              >
                {"BRAINBOX NINJAS"}
              </div>
            </li>
            <li class="nav-item">
              <a
                class="nav-link nav-link--small btn-iframe-to-mobile-trigger"
                data-toggle="tab"
                href="#profile"
                role="tab"
              >
                <i class="bootstrap-themes-icon-iphone nav-preview__icon nav-preview__icon--sm"></i>
              </a>
            </li>
          </ul>
          <div class="form-inline">
            <img
              class="mainHeader--logoLight nav-logo"
              src="https://www.nagarro.com/hubfs/NagarroWebsiteRedesign-Aug2020/Assets/Images/Nagarro%20green%20logo%20with%20white%20title.svg"
              alt="English (United States)"
              title="English (United States)"
              loading="lazy"
            ></img>
          </div>
        </div>
      </nav>
      <div class="row" style={{ marginTop: "15%" }}>
        <div class="col-md">
          {" "}
          <ImagesUpload />
        </div>
      </div>
    </div>
  );
}

export default App;
