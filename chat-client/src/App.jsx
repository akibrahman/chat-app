import { Outlet } from "react-router-dom";
import { NavBar } from "./Components/NavBar";

const App = () => {
  return (
    <div>
      <NavBar />
      <div className="min-h-[calc(100vh-64px)]">
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default App;
