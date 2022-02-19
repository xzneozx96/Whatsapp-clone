import axios from "axios";

const baseURL = "http://localhost:3500/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// one way to implement redux store outside of a react component => followed instruction on official Redux docs
// let store: any;

// export const injectStore = (_store: any) => {
//   store = _store;
// };

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (err) => {
//     const prev_req = err?.config;

//     // handling the case when request is forbidden or not sent to prevent endless loop => make sure to re-try the request once
//     // if the token has expired, all subsequent request will response with status code of 403. When this happen, we dispatch the refreshToken action to get a new token
//     if (err.response.status === 403 && !prev_req.sent) {
//       prev_req.sent = true;

//       // handle situation when refresh token has expired
//       if (err.response.data.msg === "Refresh Token has expired") {
//         store.dispatch(logout());
//         return Promise.reject(err);
//       }

//       // handle situation when new token has been returned
//       const new_token = await store.dispatch(refreshToken()).unwrap();

//       if (new_token) {
//         prev_req.headers["Authorization"] = `Bearer ${new_token}`;
//         return axiosInstance(prev_req);
//       }
//     } else {
//       return Promise.reject(err);
//     }
//   }
// );

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers!["Authorization"] = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (err) => Promise.reject(err)
// );

export default axiosInstance;
