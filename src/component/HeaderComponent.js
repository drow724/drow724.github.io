import { useEffect, useRef } from "react";

export default function HeaderComponent() {
  const header = useRef();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      document.documentElement.scrollTop >= 10
        ? header.current.classList.add("ds-fixed-header")
        : header.current.classList.remove("ds-fixed-header");
    });
  }, []);

  return (
    <header ref={header} className="ds-header" id="site-header">
      <div className="container">
        <div className="ds-header-inner">
          <a href="/" className="ds-logo">
            <span>R</span>RESUME
          </a>
          <ul className="ds-social">
            <li>
              <a
                href="https://github.com/drow724"
                target="_blank"
                rel="noreferrer"
              >
                <i className="ri-github-fill"></i>
              </a>
            </li>
            <li>
              <a
                href="https://drow724.tistory.com/"
                target="_blank"
                rel="noreferrer"
              >
                <i className="ri-home-gear-line"></i>
              </a>
            </li>
            <li>
              <a
                href="https://drow724.tistory.com/"
                target="_blank"
                rel="noreferrer"
              >
                <i className="ri-linkedin-fill"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
