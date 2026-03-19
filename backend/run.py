import os
from app.app import create_app

app = create_app()
BACKEND_PORT = os.getenv('BACKEND_PORT') or 5000

if __name__ == '__main__':
    app.run(port=BACKEND_PORT, host='0.0.0.0')