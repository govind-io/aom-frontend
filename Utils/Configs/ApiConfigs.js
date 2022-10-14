//local url
//export const API_BASE_URL = "http://localhost:3001";

//server url
export const API_BASE_URL = "https://stream.khulke.com";

export var Tokens = {
  refresh: "",
  access: "",
};

export const updateTokens = (tokens) => {
  localStorage.setItem("tokens", JSON.stringify(tokens));
  return (Tokens = tokens);
};
