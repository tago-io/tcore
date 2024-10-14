import axios from "axios";

axios.defaults.baseURL =
  process.env.INTEGRATION_TEST_URL || "http://localhost:8888";
