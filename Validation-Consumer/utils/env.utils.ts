const getEnvValue = (key: string) => {
  return Object.prototype.hasOwnProperty.call(process.env, key)
    ? process.env[key]
    : null;
};

export { getEnvValue };
