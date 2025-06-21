from Consumers.ExtractorConsumer import start_extractor_consumer


def start_all_consumers(channel):
    try:
        start_extractor_consumer(channel)
    except Exception as error:
        print(f'Error Starting All the Consumer, Terminating the Consumer, Error Due To {error}')
        raise Exception(error)
