import amqp from "amqplib";

const validationHandler = (message: amqp.Message, channel: amqp.Channel) => {
  const content = message.content.toString();
  const parseContent = JSON.parse(content);
  console.log(parseContent);
};

export default validationHandler;
