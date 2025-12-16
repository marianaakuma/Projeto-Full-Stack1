from flask import Blueprint, request, jsonify
from src.models.Comments import Comments
from src.models.Post import Post
from src.utils import db
from flask_jwt_extended import jwt_required, get_jwt_identity

comments = Blueprint('comments', __name__, url_prefix='/comments')

@comments.route('/<int:post_id>', methods=['GET'])
@jwt_required()
def get_comments(post_id):
    # Verificar se o post existe
    post = Post.query.get_or_404(post_id)
    # Qualquer usuário autenticado pode ver comentários de qualquer post
    comments = Comments.query.filter_by(post_id=post_id).all()
    return jsonify([comment.to_dict() for comment in comments]), 200


@comments.route('/<int:post_id>', methods=['POST'])
@jwt_required()
def create_comment(post_id):
    # Verificar se o post existe
    post = Post.query.get_or_404(post_id)
    # Qualquer usuário autenticado pode comentar em qualquer post
    user_id = int(get_jwt_identity())
    data = request.json
    if not data or 'content' not in data:
        return jsonify({'error': 'Content is required'}), 400
    new_comment = Comments(content=data['content'], user_id=user_id, post_id=post_id)
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({'comment': new_comment.to_dict()}), 201

@comments.route('/<int:post_id>/<int:comment_id>', methods=['PUT'])
@jwt_required()
def update_comment(post_id, comment_id):
    comment = Comments.query.get_or_404(comment_id)
    user_id = int(get_jwt_identity())
    if user_id != comment.user_id:
        return jsonify({'message': 'Unauthorized'}), 401
    data = request.json
    comment.content = data['content']
    db.session.commit()
    return jsonify({'comment': comment.to_dict()}), 200

@comments.route('/<int:post_id>/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(post_id, comment_id):
    comment = Comments.query.get_or_404(comment_id)
    user_id = int(get_jwt_identity())
    if user_id != comment.user_id:
        return jsonify({'message': 'Unauthorized'}), 401
    db.session.delete(comment)
    db.session.commit()
    return jsonify({'message': 'Comment deleted'}), 204