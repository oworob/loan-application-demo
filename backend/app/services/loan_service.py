from flask import abort
from app.config import MIN_AMOUNT, MAX_AMOUNT, MIN_PERIOD, MAX_PERIOD, SCORE_THRESHOLD
from app.assets.database import database
from app.types.loan import LoanResponse

def positive_credit_score(credit_modifier: int, loan_amount: int, loan_period: int) -> bool:
    score = (credit_modifier / loan_amount) * loan_period
    return score >= SCORE_THRESHOLD

def calculate_maximum_amount_within_period(credit_modifier: int, requested_period: int) -> int:
    max_amount = 0
    for amount in range(MIN_AMOUNT, MAX_AMOUNT + 1): # probably should add a step
        approved = positive_credit_score(credit_modifier, amount, requested_period)
        if approved and amount > max_amount:
            max_amount = amount
    return max_amount

def calculate_minimum_period_for_minimum_amount(credit_modifier: int) -> int:
    min_period = 0
    for period in range(MIN_PERIOD, MAX_PERIOD + 1):
        approved = positive_credit_score(credit_modifier, MIN_AMOUNT, period)
        if approved:
            min_period = period
            break
    return min_period


def process_loan_application(personal_code: str, requested_amount: int, requested_period: int) -> LoanResponse:
    user = database.get(personal_code)
    if not user:
        abort(404, description="User not found")

    user_credit_modifier = user.get("credit_modifier", 0)

    if user.get("debt"): # reject if has debt
        return {
            "approved": False,
            "maxAmount": 0,
            "period": 0
        }

    maximum_amount = calculate_maximum_amount_within_period(user_credit_modifier, requested_period)
    if maximum_amount >= requested_amount: # approved for this amount and period
        return {
            "approved": True,
            "maxAmount": maximum_amount,
            "period": requested_period
        }
    else:
        if maximum_amount >= MIN_AMOUNT: # not approved, found lower amount within period
             return {
                "approved": False,
                "maxAmount": maximum_amount,
                "period": requested_period
            }
        else: # not approved, try to find minimum period for minimum amount
            minimum_period = calculate_minimum_period_for_minimum_amount(user_credit_modifier)
            if minimum_period <= MAX_PERIOD:
                return {
                    "approved": False,
                    "maxAmount": MIN_AMOUNT,
                    "period": minimum_period
                }
            else: # no period found for minimum amount
                return {
                    "approved": False,
                    "maxAmount": 0,
                    "period": 0
                }
   
    
   