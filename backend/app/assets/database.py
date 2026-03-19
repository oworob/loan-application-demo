
from typing import Dict
from app.types.loan import UserData

database: Dict[str, UserData] = { # mocked database
    "49002010965": {"credit_modifier": 0, "debt": True},
    "49002010976": {"credit_modifier": 100, "debt": False},
    "49002010987": {"credit_modifier": 300, "debt": False},
    "49002010998": {"credit_modifier": 1000, "debt": False}
}