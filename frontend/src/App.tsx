import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { useAppDispatch } from "./app/hooks";
import { Chat, Intro, Sidebar } from "./components";
import { useEffect } from "react";
import { getMyConversations } from "./redux/chat-slice";
import { useSocket } from "./hooks/useSocket";

function App() {
  const userId = localStorage.getItem("userID") || "";

  // fetch all user's conversations
  const dispatch = useAppDispatch();

  useSocket(userId, dispatch);

  useEffect(() => {
    dispatch(getMyConversations(userId));
  }, [dispatch, userId]);

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
