import axios from "axios";
import { API_BASE_URL, Tokens, updateTokens } from "../Configs/ApiConfigs";

export default async function getToken() {
  let apiConfig = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Tokens.access}`,
    },
    url: `${API_BASE_URL}/user/auth/refresh`,
  };

  let response;

  try {
    response = await axios(apiConfig);
  } catch (e) {
    if (
      e.message.toLowerCase() ===
      "Request failed with status code 401".toLowerCase()
    )
      return { res: true, success: false, message: e.message };

    return { res: false, success: false, message: e.message };
  }

  if (response.status !== 200) {
    return { res: true, success: false, message: e.message };
  }

  updateTokens({ ...Tokens, refresh: response.data.refresh });
  return { res: true, success: true, data: response.data };
}
