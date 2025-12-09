from flask import Flask
from src.utils import db
from flask_migrate import Migrate
from src.models.User import User
from src.models.Post import Post
from src.models.Comments import Comments
from flask_jwt_extended import JWTManager
import os
from src.routes.auth import auth
from src.routes.posts import posts
from src.routes.comments import comments

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['secret_key'] = os.getenv('SECRET_KEY')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

    db.init_app(app)
    migrate = Migrate(app, db)
    JWTManager(app)

    app.register_blueprint(auth)
    app.register_blueprint(posts)
    app.register_blueprint(comments)

    with app.app_context():
        db.create_all()
        db.session.commit()
        return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)