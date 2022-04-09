import { ToastContainer } from "react-toastify";
import wrapper from "../Redux/Store";
import styles from "../styles/global.css";
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
