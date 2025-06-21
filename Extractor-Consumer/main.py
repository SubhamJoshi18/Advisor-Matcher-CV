import sys
from Queues import Broker
from Config.EnvConfig import dev_config



def init_extractor_service():
    try:

        queue_instance = Broker.get_broker_instance(dev_config['broker_port'],dev_config['broker_host'])
        broker_channel = queue_instance.get_channel()
        queue_instance.init_consumers(broker_channel)


    except Exception as service_error:
        print(f'Error Initiating the Extractor MicroService')
        print(f'ServiceError: Error Caused Due to : {service_error}')
        sys.exit(1)



if __name__ == "__main__":
    init_extractor_service()