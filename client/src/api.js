export const getApiUrl = () => {
  const env = process.env.NODE_ENV;
  switch (env) {
    case "development":
      return "http://localhost:3069";
    case "prod":
      return "https://a00cdbe1.ngrok.io";
    default:
      return "https://a00cdbe1.ngrok.io";
  }
};
