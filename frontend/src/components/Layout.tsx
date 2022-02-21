import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import "../App.css";
import { useAppDispatch } from "../app/hooks";
import { RootState } from "../app/store";
import { useSocket } from "../hooks/useSocket";
import { Chat, Intro, Sidebar } from "./index";

export function Layout() {
  const user = useSelector((state: RootState) => state.authReducers.user);

  // fetch all user's conversations
  const dispatch = useAppDispatch();

  useSocket(user.userId || "", dispatch);

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
