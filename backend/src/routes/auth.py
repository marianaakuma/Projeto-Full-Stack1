from flask import Blueprint, request, jsonify
from src.models.User import User
from src.utils import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity

auth = Blueprint('auth', __name__, url_prefix='/auth')

@auth.route('/register', methods=['POST'])
def register():
    data = request.json
    new_user = User(username=data['username'], email=data['email'], password=generate_password_hash(data['password']))
    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity=str(new_user.id), additional_claims={'username': new_user.username})
    return jsonify({'token': access_token, 'user': new_user.to_dict()}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    access_token = create_access_token(identity=str(user.id), additional_claims={'username': user.username})
    return jsonify({'token': access_token,  'user': user.to_dict()}), 200