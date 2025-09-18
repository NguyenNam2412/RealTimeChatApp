// read environment variables from .env file
export default () => ({
  port: parseInt(process.env.PORT ?? '5000', 10),
  database: {
    host: process.env.DB_HOST,
    url: process.env.DB_URL,
    // port: parseInt(process.env.DB_PORT ?? '6543', 10),
    // user: process.env.DB_USER,
    // pass: process.env.DB_PASS,
    name: process.env.DB_NAME,

  },
});
