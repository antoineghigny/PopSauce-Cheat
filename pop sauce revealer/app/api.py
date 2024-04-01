from flask import Flask, request, jsonify
from flask_cors import CORS
from app.services import DataService
from app.config import Config
from app.database import DatabaseOperations

def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    config = Config()
    db_ops = DatabaseOperations(config)
    db_ops.create_table()
    data_service = DataService(db_ops)

    @app.route('/', methods=['POST'])
    def receive_data():
        data = request.get_json()
        key = data.get('key')
        value = data.get('value')

        if not key or not value:
            return jsonify({'error': 'Invalid data format'}), 400

        if data_service.add_data(key, value):
            return jsonify({'message': 'Data received and inserted successfully'}), 200
        else:
            return jsonify({'error': 'Key already exists'}), 400

    @app.route('/check/<key>', methods=['GET'])
    def check_data(key: str):
        value = data_service.retrieve_data(key)
        if value is not None:
            return jsonify({'exists': True, 'value': value}), 200
        else:
            return jsonify({'exists': False}), 404

    return app