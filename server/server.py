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

def getUserId(username):
	cur = mysql.connection.cursor()
	query ='SELECT id from users where username = "%s"' % (username)
	cur.execute(query)
	rv = cur.fetchone()
	mysql.connection.commit()
	return rv[0]

def check_friends(user1, user2):
	cur = mysql.connection.cursor()
	query = """SELECT user1 from friends where (user2 = "%s" and user1 = "%s") or 
	(user1 = "%s" and user2 = "%s")""" % (getUserId(user1), getUserId(user2), getUserId(user1), getUserId(user2))
	cur.execute(query)
	rv = cur.fetchone()
	mysql.connection.commit()
	if not rv:
		return False
	else:
		return True

def approach(fromUsername, forUsername):
	cur = mysql.connection.cursor()
	query = "SELECT req_id from requests where user1 = '%s' and user2 = '%s'" % (getUserId(fromUsername), getUserId(forUsername))
	cur.execute(query)
	rv = cur.fetchall()
	if rv:
		return 1
	query = "SELECT req_id from requests where user2 = '%s' and user1 = '%s'" % (getUserId(fromUsername), getUserId(forUsername))
	cur.execute(query)
	rv = cur.fetchall()
	if rv:
		return 2
	mysql.connection.commit()
	return 0

@app.route('/api/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
	current_user = get_jwt_identity()
	return jsonify({'accessToken': create_access_token(identity = current_user)}), 200

@app.route('/api/register', methods=['POST'])
def register():
	if not request.json or not 'email' in request.json or not 'password' in request.json or not 'username' in request.json \
	or not 'name' in request.json or not 'place' in request.json \
    or not 'birthday' in request.json or not 'info' in request.json:
		return (jsonify({"msg": "invalid request or missing parameters in request", "success": 0}), 400)
	cur = mysql.connection.cursor()
	hashPass = get_hashed_password(request.json['password'])
	query = 'INSERT into users (email, password, username) values("%s", "%s", "%s")' % (request.json['email'], hashPass, request.json['username'])
	cur.execute(query)
	query = 'INSERT INTO info (id, name, place, info, birthday, image) VALUES(LAST_INSERT_ID(), "%s", "%s", "%s", "%s", "https://www.w3schools.com/w3images/avatar2.png")' \
	% (request.json['name'], request.json['place'], request.json['info'], request.json['birthday'])
	cur.execute(query)
	mysql.connection.commit()
	access_token = create_access_token(identity = request.json['username'])
	refresh_token = create_refresh_token(identity = request.json['username'])
	return (jsonify({"msg": "User registered", "success": 1, "accessToken": access_token, "refreshToken": refresh_token}), 200)

@app.route('/api/login', methods=['POST'])
def login():
	if not request.json or not 'email' in request.json or not 'password' in request.json:
		return (jsonify({"msg": "invalid request or missing parameters in request", "success": 0}), 400)
	cur = mysql.connection.cursor()
	query = 'SELECT email, password, username from users where email="%s"' % (request.json['email'])
	cur.execute(query)
	rv = cur.fetchall()
	mysql.connection.commit()
	if not rv:
		return (jsonify({"msg": "User not registered", "success": 0}), 200)
	if not verify_password(request.json['password'], rv[0][1]):
		return (jsonify({"msg":"Wrong password", "success": 0}), 200)
	access_token = create_access_token(identity = rv[0][2])
	refresh_token = create_refresh_token(identity = rv[0][2])
	return (jsonify({"msg": "User logged in", "success": 1, "accessToken": access_token, "refreshToken": refresh_token, "username": rv[0][2]}), 200)

@app.route('/api/getinfo', methods=['POST'])
@jwt_required
def getInfo():
	if not request.json or not 'username' in request.json:
		return (jsonify({"msg": "invalid request or missing parameters in request", "success": 0}), 400)
	cur = mysql.connection.cursor()
	getUserId(request.json['username'])
	query = 'SELECT name, info, place, birthday, image from info natural join users where username="%s"' % (request.json['username'])
	cur.execute(query)
	rv = cur.fetchall()
	mysql.connection.commit()
	if not rv:
		return (jsonify({"msg": "User not registered", "success": 0}), 200)
	return jsonify({"name": rv[0][0], "info": rv[0][1], "place": rv[0][2], "birthday": rv[0][3], "image": rv[0][4], "success": 1}), 200

@app.route('/api/discover', methods=['POST'])
@jwt_required
def discover():
	if not request.json or not 'username' in request.json:
		return (jsonify({"msg": "invalid request or missing parameters in request", "success": 0}), 400)
	if not request.json['username'] == get_jwt_identity():
		return (jsonify({"msg": "Invalid request", "success": 0}), 200)
	cur = mysql.connection.cursor()
	query = 'SELECT name, info, image, username from info natural join users where username <> "%s"' % (request.json['username'])
	cur.execute(query)
	row_headers=[x[0] for x in cur.description] #this will extract row headers
	rv = cur.fetchall()
	mysql.connection.commit()
	if not rv:
		return (jsonify({"msg": "No users to show", "success": 0}), 200)
	res = []
	for result in rv:
		res.append(dict(zip(row_headers,result)))
	return jsonify({"success": 1, "data": res}), 200

@app.route('/api/friends', methods=['POST'])
@jwt_required
def friends():
	if not request.json or not 'username' in request.json:
		return (jsonify({"msg": "invalid request or missing parameters in request", "success": 0}), 400)
	if not request.json['username'] == get_jwt_identity():
		return (jsonify({"msg": "Invalid request", "success": 0}), 200)
	cur = mysql.connection.cursor()
	query = """SELECT user2 as fr from friends T, users R where R.username = "%s" and T.user1 = R.id union 
	select user1 as fr from friends T, users R where R.username = "%s" and T.user2=R.id""" % (request.json['username'], request.json['username'])
	cur.execute(query)
	rv = cur.fetchall()
	if not rv:
		return (jsonify({"msg": "No friends", "success": 0}), 200)
	res = []
	for result in rv:
		query = 'SELECT name, info, image, username, id from info natural join users where id = "%s"' % (result)
		cur.execute(query)
		rv1 = cur.fetchall()
		row_headers=[x[0] for x in cur.description] #this will extract row headers
		res.append(dict(zip(row_headers,rv1[0])))
	mysql.connection.commit()
	return jsonify({"success": 1, "data": res}), 200

@app.route('/api/make_post', methods=['POST'])
@jwt_required
def makePost():
	if not request.json or not 'username' in request.json or not 'post' in request.json or not 'post_date' in request.json \
	or not 'liked' in request.json or not 'public':
		return (jsonify({"msg": "invalid request or missing parameters in request", "success": 0}), 400)
	if not request.json['username'] == get_jwt_identity():
		return (jsonify({"msg": "Invalid request", "success": 0}), 200)
	cur = mysql.connection.cursor()
	query = 'INSERT into posts(poster_id, post, post_date, liked, public) SELECT id, "%s", "%s", "%s", "%s" from users where username = "%s"' \
	% (request.json['post'], request.json['post_date'], request.json['liked'], request.json['public'], request.json['username'])
	cur.execute(query)
	mysql.connection.commit()
	return jsonify({"success": 1, "msg": "posted"}), 200

@app.route('/api/get_posts', methods=['POST'])
@jwt_required
def getPosts():
	if not request.json or not 'forUsername' in request.json or not 'fromUsername' in request.json:
		return (jsonify({"msg": "invalid request or missing parameters in request", "success": 0}), 400)
	if not request.json['fromUsername'] == get_jwt_identity():
		return (jsonify({"msg": "Invalid request", "success": 0}), 200)
	cur = mysql.connection.cursor()
	query = """SELECT post_id, poster_id, name, post_date, liked, public, post, image from posts, info 
	where poster_id = (SELECT id from users where username = '%s') and id=poster_id ORDER BY post_date DESC""" % (request.json['forUsername'])
	fr = False
	status = approach(request.json['fromUsername'], request.json['forUsername'])
	if request.json['fromUsername'] == request.json['forUsername']:
		pass
	else:
		fr = check_friends(request.json['forUsername'], request.json['fromUsername'])
		if not fr:
			query = """SELECT post_id, poster_id, name, post_date, liked, public, post, image from posts, info 
			where poster_id = (SELECT id from users where username = '%s') and id=poster_id and public = 1 ORDER BY post_date DESC""" % (request.json['forUsername'])
	cur.execute(query)
	rv = cur.fetchall()
	if not rv:
		return jsonify({"success": 1, "data": [], "friends": fr, "status": status}), 200
	res = []
	row_headers = [x[0] for x in cur.description] #this will extract row headers
	for i in rv:
		res.append(dict(zip(row_headers, i)))
	mysql.connection.commit()
	return jsonify({"success": 1, "data": res, "friends": fr, "status": status}), 200

@app.route('/api/get_friend_posts', methods=['POST'])
@jwt_required
def getFriendPosts():
	if not request.json or not 'username' in request.json:
		return (jsonify({"msg": "invalid request or missing parameters in request", "success": 0}), 400)
	if not request.json['username'] == get_jwt_identity():
		return (jsonify({"msg": "Invalid request", "success": 0}), 200)
	cur = mysql.connection.cursor()
	query = """SELECT user2 as fr from friends T, users R where R.username = "%s" and T.user1 = R.id union 
	select user1 as fr from friends T, users R where R.username = "%s" and T.user2=R.id""" % (request.json['username'], request.json['username'])
	cur.execute(query)
	rv = cur.fetchall()
	if not rv:
		return jsonify({"msg":"No posts", "success": 0}), 200
	res = []
	for result in rv:
		query = """SELECT post_id, poster_id, name, post_date, liked, public, post, image from posts, info 
		where poster_id = '%s' and id=poster_id  ORDER BY post_date DESC""" % (result)
		cur.execute(query)
		rv1 = cur.fetchall()
		row_headers=[x[0] for x in cur.description] #this will extract row headers
		for i in rv1:
			res.append(dict(zip(row_headers, i)))
	mysql.connection.commit()
	return jsonify({"success": 1, "data": res}), 200

@app.route('/api/send_request', methods=['POST'])
@jwt_required
def sendRequest():
	if not request.json or not 'forUsername' in request.json or not 'fromUsername' in request.json:
		return (jsonify({"msg": "invalid request or missing parameters in request", "success": 0}), 400)
	if not request.json['fromUsername'] == get_jwt_identity():
		return (jsonify({"msg": "Invalid request", "success": 0}), 200)
	fr = check_friends(request.json['forUsername'], request.json['fromUsername'])
	if fr:
		return (jsonify({"msg": "Already friends", "success": 0}), 200)
	cur = mysql.connection.cursor()
	query = "INSERT into requests (user1, user2, accepted) values ('%s', '%s', 0)" % (getUserId(request.json['fromUsername']), getUserId(request.json['forUsername']))
	cur.execute(query)
	mysql.connection.commit()
	return jsonify({"success": 1, "msg": "Sent request"}), 200

@app.route('/api/get_requests', methods=['POST'])
@jwt_required
def getRequests():
	if not request.json or not 'username' in request.json:
		return (jsonify({"msg": "invalid request or missing parameters in request", "success": 0}), 400)
	if not request.json['username'] == get_jwt_identity():
		return (jsonify({"msg": "Invalid request", "success": 0}), 200)
	cur = mysql.connection.cursor()
	query = "SELECT S.name, S.info, S.image, T.username from requests R, info S, users T where R.user2 = '%s' and S.id = R.user1 and T.id = S.id" % (getUserId(request.json['username']))
	cur.execute(query)
	row_headers=[x[0] for x in cur.description] #this will extract row headers
	rv = cur.fetchall()
	if not rv:
		return jsonify({"success": 0, "data": []}), 200		
	res = []
	for result in rv:
		res.append(dict(zip(row_headers,result)))
	mysql.connection.commit()
	return jsonify({"success": 1, "data": res}), 200

@app.route('/api/accept_request', methods=['POST'])
@jwt_required
def acceptRequest():
	if not request.json or not 'forUsername' in request.json or not 'fromUsername' in request.json:
		return (jsonify({"msg": "invalid request or missing parameters in request", "success": 0}), 400)
	if not request.json['fromUsername'] == get_jwt_identity():
		return (jsonify({"msg": "Invalid request", "success": 0}), 200)
	cur = mysql.connection.cursor()
	# write trigger to update requests accepted attribute
	fr = check_friends(request.json['forUsername'], request.json['fromUsername'])
	if fr:
		return (jsonify({"msg": "Already friends", "success": 0}), 200)
	query = "INSERT into friends (user1, user2) values ('%s', '%s')" % (getUserId(request.json['forUsername']), getUserId(request.json['fromUsername']))
	cur.execute(query)
	mysql.connection.commit()
	return jsonify({"success": 1, "msg": "Request accepted"}), 200

@app.route('/api/get_messages', methods=['POST'])
@jwt_required
def getMessages():
	if not request.json or not 'username' in request.json:
		return (jsonify({"msg": "invalid request or missing parameters in request", "success": 0}), 400)
	if not request.json['username'] == get_jwt_identity():
		return (jsonify({"msg": "Invalid request", "success": 0}), 200)
	cur = mysql.connection.cursor()
	myid = getUserId(request.json['username'])
	query = 'SELECT s_id, r_id, msg, dts, seen from messages where (s_id="%s" or r_id="%s") and dts>"%s"' \
	% (myid, myid, request.json['dts'])
	cur.execute(query)
	row_headers=[x[0] for x in cur.description] #this will extract row headers
	rv = cur.fetchall()
	if not rv:
		return jsonify({"success": 0, "data": []}), 200		
	res = []
	for result in rv:
		res.append(dict(zip(row_headers,result)))
	mysql.connection.commit()
	return jsonify({"success": 1, "data": res, "myid": myid}), 200

if __name__ == '__main__':
    app.run(debug=True)