#uEoGVC8xp2J7dycE
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://Robin:uEoGVC8xp2J7dycE@cluster0.udxjrbx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


client = MongoClient(uri, server_api=ServerApi('1'))

db=client.todo_dp
collection = db["todo_data"]