import React from "react";
import AboutComponent from "../component/AboutComponent";
import BannerComponent from "../component/BannerComponents";
import ExperienceComponent from "../component/ExperienceComponent";
import FooterComponent from "../component/FooterComponent";
import HeaderComponent from "../component/HeaderComponent";
import WorkComponent from "../component/WorkComponent";
import "./mainRouter.css";
import backend from "../data/backend.js";
import frontend from "../data/frontend.js";
import ciCd from "../data/cicd.js";
import projects from "../data/projects.js";
import experience from "../data/experience.js";

export const DataDispatch = React.createContext(null);

function Main() {
  return (
    <React.Fragment>
      <DataDispatch.Provider
        value={{ skills: [backend, frontend, ciCd], projects, experience }}
      >
        <HeaderComponent />
        <BannerComponent />
        <AboutComponent />
        <WorkComponent />
        <ExperienceComponent />
        <FooterComponent />
      </DataDispatch.Provider>
    </React.Fragment>
  );
}

export default Main;
