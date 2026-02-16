from functools import wraps
from flask import request
import logging


def log_request(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        logger = logging.getLogger(f.__module__)
        logger.info(f"{request.method} {request.path} - args: {dict(request.args)}")
        return f(*args, **kwargs)
    return decorated
