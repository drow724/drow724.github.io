import { useContext } from "react";
import profile from "../assets/images/profile.jpg";
import { DataDispatch } from "../router/MainRouter";

export default function BannerComponent() {
  return (
    <div className="ds-banner" style={{ marginTop: 180 }}>
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 col-xxl-5">
            <figure>
              <img src={profile} alt="profile" />
            </figure>
          </div>
          <div className="col-12 col-sm-12 col-md-7 col-lg-7 col-xl-7 col-xxl-7">
            <section>
              <h1>
                안녕하세요.
                <br />
                Java, Spring Framework기반
                <br />
                백엔드 개발자입니다.
              </h1>
              <DataDispatch.Consumer>
                {(value) => (
                  <ul className="ds-numbervalulist">
                    <li>
                      <strong>{value.experience.length}</strong>
                      <span>Experience</span>
                    </li>
                    <li>
                      <strong>{value.projects.length}</strong>
                      <span>Projects</span>
                    </li>
                  </ul>
                )}
              </DataDispatch.Consumer>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
