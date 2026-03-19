from flask import Blueprint, request
from app.services.loan_service import process_loan_application
from app.types.loan import LoanRequest, LoanResponse

loan_router = Blueprint('loans', __name__, url_prefix='/loans')

@loan_router.route('/decision', methods=['POST'])
def generate_loan_decision() -> LoanResponse:
    data: LoanRequest = request.get_json()
    personal_code = data['personalCode']
    requested_amount = data['amount']
    requested_period = data['period']

    if requested_amount < 2000 or requested_amount > 10000:
        return {"error": "Amount must be between 2000 and 10000 euro"}, 400
    if requested_period < 12 or requested_period > 60:
        return {"error": "Period must be between 12 and 60 months"}, 400

    response: LoanResponse = process_loan_application(personal_code, requested_amount, requested_period)
    return response




