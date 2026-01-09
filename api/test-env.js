export default function handler(req, res) {
  res.status(200).json({
    hasKey: !!process.env.EXCHANGE_API_KEY,
    keyLength: process.env.EXCHANGE_API_KEY
      ? process.env.EXCHANGE_API_KEY.length
      : 0,
    keyStart: process.env.EXCHANGE_API_KEY
      ? process.env.EXCHANGE_API_KEY.slice(0, 5)
      : null,
  });
}
