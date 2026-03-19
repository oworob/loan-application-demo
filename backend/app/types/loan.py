from typing import TypedDict

class UserData(TypedDict):
    credit_modifier: int
    debt: bool

class LoanRequest(TypedDict):
    personalCode: str
    amount: int
    period: int

class LoanResponse(TypedDict):
    approved: bool
    maxAmount: int
    period: int