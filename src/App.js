import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./router/MainRouter";
import Kb from "./router/kb/KbRouter";
import KbList from "./router/kb/KbListRouter";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/kb" element={<Kb />} />
        <Route path="/kb/list" element={<KbList />} />
      </Routes>
    </Router>
  );
}

export default App;
