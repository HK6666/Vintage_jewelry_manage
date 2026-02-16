import os
from dotenv import load_dotenv

load_dotenv()

from app import create_app
from app.extensions import db

app = create_app()

with app.app_context():
    from app.models import *  # noqa: F401,F403
    db.create_all()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
