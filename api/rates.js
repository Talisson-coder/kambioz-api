import axios from "axios";

let cache = {
  data: null,
  lastUpdate: null,
};

const ONE_HOUR = 60 * 60 * 1000;

export default async function ratesHandler(req, res) {
  try {
    const apiKey = process.env.EXCHANGE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "API key não encontrada",
      });
    }

    const now = Date.now();

    // usa cache
    if (cache.data && now - cache.lastUpdate < ONE_HOUR) {
      return res.json({
        source: "cache",
        updated_at: cache.lastUpdate,
        data: cache.data,
      });
    }

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
    );

    cache = {
      data: response.data,
      lastUpdate: now,
    };

    return res.json({
      source: "api",
      updated_at: now,
      data: response.data,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: "Erro ao buscar taxas",
      details: error.message,
    });
  }
}
