import axios from "axios";

let cache = {
  data: null,
  lastUpdate: null,
};

const ONE_HOUR = 60 * 60 * 1000;

export default async function handler(req, res) {
  try {
    const now = Date.now();

    // 🔁 Usa cache se ainda estiver válido
    if (cache.data && now - cache.lastUpdate < ONE_HOUR) {
      return res.status(200).json({
        source: "cache",
        updated_at: cache.lastUpdate,
        data: cache.data,
      });
    }

    // 🌐 Chamada à Exchange Rate API
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/USD`
    );

    cache = {
      data: response.data,
      lastUpdate: now,
    };

    return res.status(200).json({
      source: "api",
      updated_at: now,
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar taxas",
      details: error.message,
    });
  }
}