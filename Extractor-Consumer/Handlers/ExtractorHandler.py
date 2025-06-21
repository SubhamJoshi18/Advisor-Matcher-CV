



def extractor_handler(msg):
    try:
        print(msg)
    except Exception as error:
        print(f'Error While Handling the Message, Error : {error}')
        raise Exception(error)
