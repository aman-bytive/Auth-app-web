import "./App.css";
import NavigationRoutes from "./navigation/NavigationRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <NavigationRoutes />
      {/* Toast container to display toasts */}
      <ToastContainer />
    </>
  );
}

export default App;
