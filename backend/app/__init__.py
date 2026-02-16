import os
import logging
from logging.handlers import TimedRotatingFileHandler
from flask import Flask, jsonify
from .config import config
from .extensions import db, migrate, jwt, cors


def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'default')

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    _setup_logging(app)
    _init_extensions(app)
    _register_blueprints(app)
    _register_error_handlers(app)
    _register_cli(app)

    return app


def _setup_logging(app):
    log_format = '[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s'
    formatter = logging.Formatter(log_format)

    # Console handler
    console = logging.StreamHandler()
    console.setLevel(logging.DEBUG)
    console.setFormatter(formatter)

    # File handler
    log_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')
    os.makedirs(log_dir, exist_ok=True)
    file_handler = TimedRotatingFileHandler(
        os.path.join(log_dir, 'app.log'),
        when='midnight',
        backupCount=30,
        encoding='utf-8',
    )
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)

    root = logging.getLogger()
    root.setLevel(logging.DEBUG)
    root.addHandler(console)
    root.addHandler(file_handler)

    app.logger.info('Logging initialized')


def _init_extensions(app):
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r'/api/*': {'origins': '*'}})


def _register_blueprints(app):
    from .api import register_blueprints
    register_blueprints(app)


def _register_error_handlers(app):
    @app.errorhandler(404)
    def not_found(e):
        return jsonify(code=404, message='Resource not found'), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify(code=500, message='Internal server error'), 500

    @app.errorhandler(422)
    def unprocessable(e):
        return jsonify(code=422, message='Unprocessable entity'), 422


def _register_cli(app):
    @app.cli.command('seed')
    def seed_command():
        """Initialize database with seed data."""
        from .seeds import seed_all
        seed_all()
        print('Seed data loaded successfully.')

    @app.cli.command('init-db')
    def init_db_command():
        """Create all tables."""
        db.create_all()
        print('Database tables created.')
