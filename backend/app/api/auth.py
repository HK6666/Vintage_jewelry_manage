import logging
from flask import Blueprint, request
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity,
)
from ..extensions import db
from ..models.user import User
from ..utils.response import success, error

logger = logging.getLogger(__name__)
bp = Blueprint('auth', __name__)


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    username = data.get('username', '')
    password = data.get('password', '')
    logger.info(f"POST /auth/login - username: {username}")

    if not username or not password:
        logger.warning("Login failed: missing credentials")
        return error('用户名和密码不能为空', 400)

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        logger.warning(f"Login failed for username: {username}")
        return error('用户名或密码错误', 401)

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    logger.info(f"User {username} logged in successfully")

    return success({
        'token': access_token,
        'refreshToken': refresh_token,
        'expiresIn': 7200,
        'user': user.to_dict(),
    }, '登录成功')


@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    logger.info(f"POST /auth/refresh - user_id: {identity}")
    access_token = create_access_token(identity=identity)
    return success({'token': access_token, 'expiresIn': 7200})


@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    identity = get_jwt_identity()
    logger.info(f"POST /auth/logout - user_id: {identity}")
    return success(message='退出成功')


@bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    identity = get_jwt_identity()
    logger.info(f"GET /auth/me - user_id: {identity}")
    user = db.session.get(User, int(identity))
    if not user:
        return error('用户不存在', 404)
    return success(user.to_dict())
