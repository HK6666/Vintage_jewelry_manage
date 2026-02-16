from flask import jsonify


def success(data=None, message='success', code=200):
    resp = {'code': code, 'message': message}
    if data is not None:
        resp['data'] = data
    return jsonify(resp), code


def error(message='error', code=400):
    return jsonify({'code': code, 'message': message}), code
