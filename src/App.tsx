import "./App.css";
import { Chat, Sidebar } from "./components";

function App() {
  return (
    <div className="app--wrap">
      <div className="app--main">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default App;
