import pika
import json
from Config.EnvConfig import dev_config
from Constants.ElasticConstant import elasticQueueConstant
import time
import pika

class Broker:

    connection = None
    channel = None

    def __init__(self,rabbitmq_port,rabbitmq_host):
        self.rabbitmq_port = rabbitmq_port
        self.rabbitmq_host = rabbitmq_host


    def initalize_connection(self,max_retries=3, retry_delay=2):
        for attempt in range(0,max_retries + 1):
            try:
                if self.connection is None and self.channel is None:
                    self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.rabbitmq_host,port=self.rabbitmq_port))
                    self.channel = self.connection.channel()
            except Exception as broker_error:
                print(f'Error Connecting to the RabbitMQ Reason {broker_error}, Retrying The Connection : {max_retries}')
                if attempt < max_retries:
                    time.sleep(retry_delay)
                else:
                    print(f'Maximum Retry Count Has Been Exceeded')
                    return None

    def get_channel(self):
        if self.channel is not None:
            return self.channel
        else:
            self.initalize_connection()
            return self.channel

    def get_connection(self):
        if self.connection is not None:
            return self.connection
        else:
            self.initalize_connection()
            return self.connection

    def close_channel(self):
        if self.channel:
            self.channel = None
        return True

    def close_connection(self):
        if self.connection:
            self.connection = None
        return True






def publish_to_elastic_consumers(payload, queue_name=elasticQueueConstant['queueName']):
    broker_instance = Broker(dev_config['broker_port'],dev_config['broker_host'])
    print(f'Opening the Broker Channel')
    broker_channel = broker_instance.get_channel()
    try:
        broker_channel.exchange_declare(exchange=elasticQueueConstant['queueExchange'],exchange_type='direct',durable=True)
        broker_channel.queue_declare(queue=queue_name, durable=True)

        message = json.dumps(payload)

        broker_channel.basic_publish(
            exchange='',
            routing_key=queue_name,
            body=message,
            properties=pika.BasicProperties(
                delivery_mode=2
            )
        )
        print(f"✅ Payload successfully published to queue '{queue_name}'")
    except Exception as e:
        print(f"❌ Failed to publish message to '{queue_name}', Error: {e}")
        raise
    finally:
        print(f"Broker Channel Close")
        broker_close = broker_instance.close_channel()

