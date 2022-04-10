import { ToastContainer } from "react-toastify";
import styles from "../styles/global.css";
import "react-toastify/dist/ReactToastify.css";
import { wrapper } from "../Redux/Store";
function MyApp({ Component, pageProps }) {
  return (
    <div
      style={{
        height: "100vh",
        scrollY: "auto",
      }}
    >
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default wrapper.withRedux(MyApp);
