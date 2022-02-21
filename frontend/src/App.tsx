import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage, SignupPage, RequireAuth, Layout } from "./components";

function App() {
  return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
    
        <Route element={<RequireAuth />}>
          <Route path="/*" element={<Layout />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
