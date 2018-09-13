#!flask/bin/python
from flask import Flask, jsonify, abort, request
from flask_mysqldb import MySQL
import requests
import uuid
import json
import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'utk3012'
app.config['MYSQL_DB'] = 'social'
app.config['MYSQL__HOST'] = 'localhost'
mysql = MySQL(app)

@app.route('/api/register', methods=['POST'])
def register():
	if not request.json or not 'email' in request.json or not 'password' in request.json \
    or not 'u_email' in request.json or not 'u_dob' in request.json


if __name__ == '__main__':
    app.run(debug=True)