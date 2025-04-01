import pathlib
import json
from typing import Dict, List

_data_dir = pathlib.Path(__file__).parent / "data"
_json_file = _data_dir / "myfile_12214760.json"

with open(_json_file, "r") as f:
    _data = json.load(f)

def print_user_basic_info(user: Dict):
    print(f"\nUser: {user['name']}")
    print(f"ID: {user['id']}")
    print(f"Email: {user['email']}")
    print(f"Membership: {user['membership']}")
    print(f"Status: {'Active' if user['is_active'] else 'Inactive'}")

def print_user_orders(user: Dict):
    print(f"\nOrders for {user['name']}:")
    if not user['orders']:
        print("No orders found")
        return
    
    for order in user['orders']:
        print(f"Order ID: {order['order_id']}")
        print(f"Date: {order['date']}")
        print(f"Total: ${order['total']}")
        print(f"Items: {', '.join(order['items'])}")
        print("---")

def display_all_users():
    for user in _data['users']:
        print_user_basic_info(user)
        print_user_orders(user)
        print("=" * 100)

if __name__ == "__main__":
    display_all_users()

