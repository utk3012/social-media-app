from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_socketio import join_room, leave_room
from flask_mysqldb import MySQL
import requests
import uuid
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'utk3012'
app.config['MYSQL_DB'] = 'social'
app.config['MYSQL__HOST'] = 'localhost'
mysql = MySQL(app)

socketio = SocketIO(app)
users = list()

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('join')
def on_join(data):
    users.append(data)
    join_room(data)

@socketio.on('chat message')
def on_msg(mess):
    msg = mess['msg']
    r_id = mess['r_id']
    s_id = mess['s_id']
    dts = mess['dts']
    cur = mysql.connection.cursor()
    if r_id in users:
        seen = 't'
    else:
        seen = 'f'
    query = 'INSERT into messages (s_id, r_id, dts, seen, msg) values ("%s", "%s", "%s", "%s", "%s")' % (s_id, r_id, dts, seen, msg)
    cur.execute(query)
    mysql.connection.commit()
    emit('chat message', {'msg': msg, 's_id': s_id,'r_id': r_id, 'seen': seen, 'dts': dts}, room=r_id)

@socketio.on('leave')
def on_leave(data):
    if data in users:
        users.remove(data)
    leave_room(data)

if __name__ == '__main__':
    socketio.run(app, host='localhost', port=4000)
