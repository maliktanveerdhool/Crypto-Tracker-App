import axios from 'axios';

const BASE_URL = 'https://api.coincap.io/v2';

export interface Crypto {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  supply: string;
}

export interface CryptoHistory {
  priceUsd: string;
  time: number;
}

export const api = {
  getAssets: async (): Promise<Crypto[]> => {
    const response = await axios.get(`${BASE_URL}/assets`);
    return response.data.data;
  },

  getAssetHistory: async (id: string): Promise<CryptoHistory[]> => {
    const response = await axios.get(
      `${BASE_URL}/assets/${id}/history?interval=h1`
    );
    return response.data.data;
  },
};