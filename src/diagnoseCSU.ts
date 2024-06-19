import axios from "axios";

export const diagnoseCSU = async (
  csuEndpoint: string,
  oun: string,
  channelId: number
) => {
  const searchByCrteria = await sendSearchByCriteria(
    csuEndpoint,
    oun,
    channelId
  );
  return {
    searchByCrteria,
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

  try {
    const response = await axios.post(
      `${csuEndpoint}Commerce/Products/SearchByCriteria?$top=20&$count=true&api-version=7.3`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          OUN: oun,
          "accept-language": "en-us",
        },
      }
    );

    // return error message
    if (response.status !== 200) {
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response);
      return error.response;
    } else {
      console.error("Unexpected error:", error);
      return error;
    }
  }
};
