
const config = {
  DATABASE_URL: process.env.DATABASE_URL || '', // for production/staging

  PG_URL: process.env.PG_URL || 'postgres://postgres:ap50m1m@localhost:5432/react_go', // for local

  jwt_secret: process.env.JWT_SECRET || 'secret'

};

export default config;