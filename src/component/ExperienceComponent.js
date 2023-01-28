import { DataDispatch } from "../router/MainRouter";

export default function ExperienceComponent() {
  return (
    <div className="ds-experience-section">
      <div className="container">
        <h2 className="ds-heading">Experience</h2>
        <div className="row ds-experience-list">
          <DataDispatch.Consumer>
            {({ experience }) =>
              experience.map((ex) => (
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                  <section>
                    <span className="ds-year">{ex.title}</span>
                    <h3 className="ds-officename">{ex.subTitle}</h3>
                    <p>{ex.content}</p>
                    <ul>
                      {ex.list.map((data) => (
                        <li>
                          {data.type === "a" && (
                            <a
                              href={data.link}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {data.title}
                            </a>
                          )}
                          {data.type === "text" && <p>{data.title}</p>}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              ))
            }
          </DataDispatch.Consumer>
        </div>
      </div>
    </div>
  );
}
