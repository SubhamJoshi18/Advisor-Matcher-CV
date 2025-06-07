function formattedMongooseRequiredMessage(value: string) {
  return `${value} Must be Required in the MongoDB (Schema Required)`;
}

function terminateServer() {
  process.exit(1);
}

export { formattedMongooseRequiredMessage, terminateServer };
