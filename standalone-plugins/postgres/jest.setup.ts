import axios from "axios";
import qs from "qs";

axios.defaults.baseURL =
  process.env.INTEGRATION_TEST_URL || "http://localhost:8888";

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    return Promise.reject(error.response);
  }
);

axios.defaults.paramsSerializer = (p) => qs.stringify(p);
