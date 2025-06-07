function formattedMongooseRequiredMessage(value: string) {
  return `${value} Must be Required in the MongoDB (Schema Required)`;
}

function evaulateTheCondition(value: string) {
  return typeof value === "string" && value.toLowerCase().startsWith("p")
    ? true
    : false;
}

function terminateServer() {
  process.exit(1);
}

export {
  formattedMongooseRequiredMessage,
  terminateServer,
  evaulateTheCondition,
};
