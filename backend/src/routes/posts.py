from flask import Blueprint, request, jsonify
from src.models.Post import Post
from src.utils import db
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

posts = Blueprint('posts', __name__, url_prefix='/posts')

@posts.route('/', methods=['GET', 'OPTIONS'])
@posts.route('', methods=['GET', 'OPTIONS'], strict_slashes=False)
def get_posts():
    posts = Post.query.all()
    return jsonify([post.to_dict() for post in posts]), 200

@posts.route('/', methods=['POST'])
@jwt_required()
def create_post():
    data = request.json
    if not data or 'title' not in data or 'content' not in data:
        return jsonify({'error': 'Title and content are required'}), 400
    
    user_id = int(get_jwt_identity())
    jwt_data = get_jwt()
    new_post = Post(title=data['title'], content=data['content'], author=jwt_data['username'], user_id=user_id)
    db.session.add(new_post)
    db.session.commit()
    return jsonify({'post': new_post.to_dict()}), 201

@posts.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_post(id):
    post = Post.query.get_or_404(id)
    user_id = int(get_jwt_identity())
    if post.user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 401
    return jsonify(post.to_dict()), 200

@posts.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_post(id):
    data = request.json
    post = Post.query.get_or_404(id)
    user_id = int(get_jwt_identity())
    if post.user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 401
    post.title = data['title']
    post.content = data['content']
    db.session.commit()
    return jsonify({'post': post.to_dict()}), 200


@posts.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_post(id):
    post = Post.query.get_or_404(id)
    user_id = int(get_jwt_identity())
    if post.user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 401
    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': 'Post deleted'}), 204
