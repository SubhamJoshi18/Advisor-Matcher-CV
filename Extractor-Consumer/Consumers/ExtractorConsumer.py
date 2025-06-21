import pika
from Config.QueueConfig import extractor_queue
from Handlers.ExtractorHandler import extractor_handler


def start_extractor_consumer(channel):
    try:

        channel.exchange_declare(exchange=extractor_queue['queueExchange'], exchange_type='direct', durable=True)
        channel.queue_declare(queue=extractor_queue['queueName'], durable=True)

        def callback(ch, method, properties, body):
            try:
                parse_content = body.decode()
                print(f"Received message: {parse_content}")
                extractor_handler(parse_content)
                ch.basic_ack(delivery_tag=method.delivery_tag)
            except Exception as processing_error:
                print(f"Error processing message: {processing_error}")

                ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)


        channel.basic_consume(queue=extractor_queue['queueName'], on_message_callback=callback)
        print(" [*] Waiting for messages in the Extractor Microservice. To exit press CTRL+C")
        channel.start_consuming()

    except Exception as error:
        print(f'Error consuming the extractor service: {error}')
        raise
