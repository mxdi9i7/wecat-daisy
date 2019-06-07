export const getApiUrl = () => {
  const env = process.env.NODE_ENV;
  switch (env) {
    case "development":
      return "http://localhost:3069";
    case "prod":
      return "https://wecat-daisy.demo.bctc.io";
    default:
      return "https://wecat-daisy.demo.bctc.io";
  }
};
