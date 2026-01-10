export const config = {
  runtime: "nodejs", // força Node (não Edge)
};

let cache = {
  data: null,
  lastUpdate: 0,
};

const ONE_HOUR = 60 * 60 * 1000;

export default async function handler(req, res) {

  if (!process.env.EXCHANGE_API_KEY) {
    return res.status(500).json({
      error: "API key não encontrada",
      debug: Object.keys(process.env),
    });
  }


  try {
    const now = Date.now();

    // 🧠 Cache em memória
    if (cache.data && now - cache.lastUpdate < ONE_HOUR) {
      return res.status(200).json({
        source: "cache",
        updated_at: cache.lastUpdate,
        data: cache.data,
      });
    }

    const apiKey = process.env.EXCHANGE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "API key não encontrada",
      });
    }

    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "kambioz-api/1.0",
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: "Erro ao buscar taxas",
        status: response.status,
        details: text,
      });
    }

    const data = await response.json();

    cache = {
      data,
      lastUpdate: now,
    };

    return res.status(200).json({
      source: "api",
      updated_at: now,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Erro inesperado",
      details: err.message,
    });
  }
}
