export const API_BASE_URL = `http://${
  typeof window !== "undefined" ? location.hostname : ""
}:3001`;
export var Tokens = {
  refresh: "",
  access: "",
};

export const updateTokens = (tokens) => {
  localStorage.setItem("tokens", JSON.stringify(tokens));
  return (Tokens = tokens);
};
