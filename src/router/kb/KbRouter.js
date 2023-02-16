import React, { useEffect, useState } from "react";
import "./KbRouter.css";
import kb from "../../data/kb/kb.js";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useNavigate } from "react-router-dom";

function Kb() {
  const [phase, setPhase] = useState(0);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setPrev(phase > 0);
    setNext(kb.length - 1 !== phase);
  }, [phase]);

  dark['pre[class*="language-"]'].height = 500;
  dark['pre[class*="language-"]'].overflow = "overlay";
  dark['pre[class*="language-"]'].width = 800;

  return (
    <React.Fragment>
      <div className="wrap">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <div className="detail">
            <div>
              {kb[phase].content.map((data) => (
                <p key={data}>{data}</p>
              ))}
            </div>
            {kb[phase].code && (
              <ReactMarkdown
                children={kb[phase].code}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    return (
                      <SyntaxHighlighter
                        children={String(children).replace(/\n$/, "")}
                        style={{ ...dark, height: "200px" }}
                        language={"java"}
                        PreTag="div"
                        {...props}
                      />
                    );
                  },
                }}
              />
            )}
            {kb[phase].image && (
              <div>
                <img src={kb[phase].image} alt={kb[phase].image} width={400} />
              </div>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <button
                className="ds-button"
                onClick={() => setPhase((prev) => prev - 1)}
                style={{ display: prev ? "block" : "none" }}
              >
                Prev
              </button>
            </div>
            <div>
              <button
                className="ds-button"
                onClick={() => {
                  next ? setPhase((prev) => prev + 1) : navigate(`/kb/list`);
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Kb;
