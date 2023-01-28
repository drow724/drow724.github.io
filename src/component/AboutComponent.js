import React from "react";
import { DataDispatch } from "../router/MainRouter";
import resume from "../assets/file/resume.pdf"

export default function AboutComponent() {
  return (
    <React.Fragment>
      <div className="ds-about-section">
        <div className="container">
          <section>
            <h2 className="ds-heading">About Me</h2>
            <p>
              Java, Spring Framework를 기반으로 현업에서 백엔드 업무를
              맡고있으며,
              <br />
              사이드 프로젝트를 통해 Express, React js등 Web 중심적으로
              공부했습니다.
              <br />
              좋은 사람들과 소통하여 부족한 부분을 알게되고, 배우고, 발전하고
              싶습니다.
            </p>
            <div className="ds-button-sec text-center">
              <a href={resume} className="ds-button" target="_blank" download="송재근 | 서버 백엔드 엔지니어" rel="noreferrer">
                Download Resume
              </a>
            </div>
          </section>
        </div>
      </div>
      <div className="ds-skills-section">
        <div className="container">
          <div className="row">
            <DataDispatch.Consumer>
              {({ skills }) =>
                skills.map((skill) => (
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                    <h2 className="ds-heading">{skill.title}</h2>
                    <ul className="ds-skills-list">
                      {skill.content.map((data) => (
                        <li>{data.name}</li>
                      ))}
                    </ul>
                  </div>
                ))
              }
            </DataDispatch.Consumer>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
