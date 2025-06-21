import time
import pika
from Consumers.BrokerConsumer import start_all_consumers

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



    def init_consumers(self,channel):
        start_all_consumers(channel)

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



def get_broker_instance(rabbitmq_port,rabbitmq_host):
    return Broker(rabbitmq_port,rabbitmq_host)
