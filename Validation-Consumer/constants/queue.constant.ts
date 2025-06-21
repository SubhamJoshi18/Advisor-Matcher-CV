const validationQueueConstant = {
  queueName: "cv:validation-queue-consumer",
  queueExchange: "cv-exchange",
};

const extractorQueueConstant = {
  queueName: "cv:extractor-queue-consumer",
  queueExchange: "cv-exchange",
};

const directExchange = "direct";

export { validationQueueConstant, directExchange, extractorQueueConstant };
