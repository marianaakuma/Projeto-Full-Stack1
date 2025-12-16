from flask import Flask, request, jsonify
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
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['secret_key'] = os.getenv('SECRET_KEY')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    # Desabilitar redirecionamento automático de URLs (evita 308 em preflight CORS)
    app.url_map.strict_slashes = False

    db.init_app(app)
    migrate = Migrate(app, db)
    JWTManager(app)
    
    # Configurar CORS para permitir requisições do frontend
    # supports_credentials permite envio de cookies/credenciais
    # automatic_options=True garante que OPTIONS seja tratado automaticamente
    CORS(app, 
         origins=["https://cuddly-engine-wr5p647g9p5c9pr-5173.app.github.dev", "http://localhost:3000"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
         allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
         supports_credentials=True,
         expose_headers=["Content-Type", "Authorization"],
         automatic_options=True)

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