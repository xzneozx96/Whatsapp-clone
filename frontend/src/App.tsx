import "./App.css";
import { Chat, Intro, Sidebar } from "./components";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSocket } from "./hooks/useSocket";

function App() {
  // const dispatch = useDispatch();
  const userId = "12312sdqw4w2e";

  useSocket(userId);

  return (
    <div className="app--wrap">
      <div className="app--main">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Intro />}></Route>
          <Route path="/:conversationId" element={<Chat />}></Route>

          {/* redirect no-existing routes to home page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
