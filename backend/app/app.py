import os
from flask import Flask, Blueprint
from flask_cors import CORS

FRONTEND_PORT = os.getenv('FRONTEND_PORT') or 5173

from app.routes.loan_router import loan_router

def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, origins=f"http://localhost:{FRONTEND_PORT}")
    
    # routes
    api = Blueprint('api', __name__, url_prefix='/api')
    api.register_blueprint(loan_router)
    app.register_blueprint(api)

    return app