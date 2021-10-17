require("dotenv").config();
export default {
  corsOrigin: "*",
  port: 4000,
  host: `${process.env.HOST}`,
};
