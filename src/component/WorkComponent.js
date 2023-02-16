import { DataDispatch } from "../router/MainRouter";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function WorkComponent() {
  const navigate = useNavigate();

  return (
    <div className="ds-work-section">
      <div className="container">
        <h2 className="ds-heading">Latest works</h2>
        <div className="ds-work-list-section">
          <DataDispatch.Consumer>
            {({ projects }) =>
              projects.map((project) => (
                <div className="ds-work-list">
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-7 col-lg-7 col-xl-7 col-xxl-7">
                      <section>
                        <h3 className="ds-work-tilte">{project.title}</h3>
                        <div className="row ds-experience-list">
                          <div>
                            <ul>
                              {project.list.map((data) => (
                                <React.Fragment>
                                  <li>{data}</li>
                                  <br />
                                </React.Fragment>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {project.detail &&
                          (project.detail.text === "datail" ? (
                            <button
                              onClick={() => navigate(project.detail.link)}
                              className="ds-button"
                            >
                              {project.detail.text}
                            </button>
                          ) : (
                            <a
                              href={project.detail.link}
                              target="_blank"
                              className="ds-button"
                              rel="noreferrer"
                            >
                              {project.detail.text}
                            </a>
                          ))}
                      </section>
                    </div>
                    <div
                      className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 col-xxl-5"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <figure>
                        <img
                          style={{ maxWidth: 400, maxHeight: 200 }}
                          src={project.image}
                          alt={project.title}
                        />
                      </figure>
                    </div>
                  </div>
                </div>
              ))
            }
          </DataDispatch.Consumer>
        </div>
      </div>
    </div>
  );
}
