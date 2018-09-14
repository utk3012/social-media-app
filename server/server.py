#!flask/bin/python
from flask import Flask, jsonify, abort, request
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
from flask_mysqldb import MySQL
import requests
import bcrypt
import json
import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'utk3012'
app.config['MYSQL_DB'] = 'social'
app.config['MYSQL__HOST'] = 'localhost'
app.config['JWT_SECRET_KEY'] = 'linustorvalds'
jwt = JWTManager(app)
mysql = MySQL(app)

def get_hashed_password(plain_text_password):
    return bcrypt.hashpw(plain_text_password, bcrypt.gensalt())

def verify_password(plain_text_password, hashed_password):
    return bcrypt.checkpw(plain_text_password, hashed_password)

@app.route('/api/register', methods=['POST'])
def register():
	if not request.json or not 'email' in request.json or not 'password' in request.json \
	or not 'name' in request.json or not 'place' in request.json \
    or not 'birthday' in request.json or not 'info' in request.json:
		return (jsonify({"msg":"invalid request or missing parameters in request", "success": 0}), 400)
	cur = mysql.connection.cursor()
	hashPass = get_hashed_password(request.json['password'])
	query = 'INSERT into users (email, password) values("%s", "%s")' % (request.json['email'], hashPass)
	cur.execute(query)
	query = 'INSERT INTO info (id, name, place, info, birthday, image) VALUES(LAST_INSERT_ID(), "%s", "%s", "%s", "%s", "https://www.w3schools.com/w3images/avatar2.png")' \
	% (request.json['name'], request.json['place'], request.json['info'], request.json['birthday'])
	cur.execute(query)
	mysql.connection.commit()
	access_token = create_access_token(identity = request.json['email'])
	refresh_token = create_refresh_token(identity = request.json['email'])
	return (jsonify({"msg": "User registered", "success": 1, "accessToken": access_token, "refreshToken": refresh_token}), 200)

@app.route('/api/login', methods=['POST'])
def login():
	if not request.json or not 'email' in request.json or not 'password' in request.json:
		return (jsonify({"msg":"invalid request or missing parameters in request", "success": 0}), 400)
	cur = mysql.connection.cursor()
	query = 'SELECT email, password from users where email="%s"' % (request.json['email'])
	cur.execute(query)
	rv = cur.fetchall()
	if not rv:
		return (jsonify({"msg":"User not registered", "success": 0}), 200)
	if not verify_password(request.json['password'], rv[0][1]):
		return (jsonify({"msg":"Wrong password", "success": 0}), 200)
	access_token = create_access_token(identity = request.json['email'])
	refresh_token = create_refresh_token(identity = request.json['email'])
	return (jsonify({"msg": "User logged in", "success": 1, "accessToken": access_token, "refreshToken": refresh_token}), 200)

@app.route('/api/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    current_user = get_jwt_identity()
    return jsonify({'accessToken': create_access_token(identity=current_user)}), 200

@app.route('/api/getinfo', methods=['POST'])
@jwt_required
def getInfo():
	if not request.json or not 'email' in request.json:
		return (jsonify({"msg":"invalid request or missing parameters in request", "success": 0}), 400)
	cur = mysql.connection.cursor()
	query = 'SELECT name, info, place, birthday, image from info natural join users where email="%s"' % (request.json['email'])
	cur.execute(query)
	rv = cur.fetchall()
	if not rv:
		return (jsonify({"msg":"User not registered", "success": 0}), 400)
	return jsonify({"name": rv[0][0], "info": rv[0][1], "place": rv[0][2], "birthday": rv[0][3], "image": rv[0][4], "success": 1}), 200

if __name__ == '__main__':
    app.run(debug=True)