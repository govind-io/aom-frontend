export const API_BASE_URL = "https://live-rt-backend.herokuapp.com";
export var Tokens = {
  refresh: "",
  access: "",
};

export const updateTokens = (tokens) => {
  localStorage.setItem("tokens", JSON.stringify(tokens));
  return (Tokens = tokens);
};
