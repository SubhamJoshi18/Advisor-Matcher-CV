from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

dev_config = {
    "broker_port" : "5672",
    "broker_host" : "localhost"
}