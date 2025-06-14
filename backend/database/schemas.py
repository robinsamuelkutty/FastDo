def individual_data(todo):
    return {
        "id": str(todo["_id"]),
        "title": todo["title"],
        "description": todo["description"],
        "is_completed": todo["is_completed"],
    }

def all_tasks(todos):
    return [individual_data(todo) for todo in todos]