import axios from "axios";
import { ApiUrl } from "./config";

export const diagnoseAnonymousCSU = async (
  csuEndpoint: string,
  oun: string,
  channelId: number
) => {
  const searchByCriteria = await sendSearchByCriteria(
    csuEndpoint,
    oun,
    channelId
  );
  return {
    searchByCriteria,
  };
};

export const diagnoseSigninCSU = async (
  csuEndpoint: string,
  oun: string,
  token: string
) => {
  const customerResponse = await getCustomer(csuEndpoint, oun, token);

  // todo, may do some cart check
  return {
    getCustomer: customerResponse,
  };
};

const sendSearchByCriteria = async (
  csuEndpoint: string,
  oun: string,
  channelId: number
) => {
  const requestBody = {
    searchCriteria: {
      Context: {
        ChannelId: channelId,
        CatalogId: 0,
      },
      IncludeAttributes: true,
      SkipVariantExpansion: true,
    },
  };
  const body = {
    method: "POST",
    endpoint: `${csuEndpoint}Commerce/Products/SearchByCriteria?$top=20&$count=true&api-version=7.3`,
    body: requestBody,
    headers: {
      "Content-Type": "application/json",
      OUN: oun,
      "accept-language": "en-us",
    },
  };

  try {
    const response = await axios.post(`${ApiUrl}/csu`, body);

    // return error message
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response);
      return error?.response?.data;
    } else {
      console.error("Unexpected error:", error);
      return undefined;
    }
  }
};

const getCustomer = async (csuEndpoint: string, oun: string, token: string) => {
  try {
    const body = {
      method: "GET",
      endpoint: `${csuEndpoint}Commerce/Customers('')?api-version=7.3`,
      headers: {
        "Content-Type": "application/json",
        OUN: oun,
        "accept-language": "en-us",
        Authorization: `id_token ${token}`,
      },
    };

    const response = await axios.post(`${ApiUrl}/csu`, body);

    // return error message
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response);
      return error?.response?.data;
    } else {
      console.error("Unexpected error:", error);
      return undefined;
    }
  }
};
