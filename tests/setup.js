process.env.MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/backend2-test";
process.env.JWT_SECRET =
  process.env.JWT_SECRET || "test-secret-solo-para-automated-tests";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
process.env.NODE_ENV = "test";
