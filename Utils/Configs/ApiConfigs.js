export const API_BASE_URL = "http://127.0.0.1:5000";
export var Tokens = {
  refresh: "",
  access: "",
};

export const updateTokens = (tokens) => {
  localStorage.setItem("tokens", JSON.stringify(tokens));
  return (Tokens = tokens);
};
