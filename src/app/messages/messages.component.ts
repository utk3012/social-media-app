import { Component, OnDestroy, OnInit } from '@angular/core';
import * as io from "socket.io-client";

import { GetInfoService } from '../services/get-info.service';
import { NgForm } from '@angular/forms';
import { RefreshTokenService } from '../services/refresh-token.service';

interface Dictionary {
  [index: string]: {msg: string, dts: string, seen: string};
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
  selectedFriend = -1;
  username: string;
  users: any[];
  showMess = false;
  myId: number;
  socket = io('http://localhost:4000');
  messages: {msg: string, s_id: string, r_id: string, seen?: string, dts: string}[] = [];
  lastMessages = {} as Dictionary;

  constructor(private getInfoService: GetInfoService, private refreshTokenService: RefreshTokenService) { }

  ngOnInit() {
    const accessToken = localStorage.getItem('accessToken');
    this.username = localStorage.getItem('username');
    this.getInfoService.getFriends({username: this.username}, accessToken)
      .subscribe((dat: {success: number, data: any, myid: number}) => {
        if (dat.success === 1) {
          this.users = dat.data;
          this.myId = dat.myid;
          this.getInfoService.getMessages({username: this.username, dts: '2018-09-23T10:01:00'}, accessToken)
            .subscribe((res: any) => {
                this.messages = res.data;
                this.getLastMessages();
                this.socket.emit('join', this.myId);
                this.socket.on('chat message', function(msg: any) {
                  this.messages.push({msg: msg.msg, s_id: msg.s_id + '', r_id: msg.r_id + '', seen: msg.seen, dts: msg.dts});
                }.bind(this));
              },
              error => {
                if (error.status === 422 || error.error.msg === 'Token has expired') {
                  const refreshToken = localStorage.getItem('refreshToken');
                  console.log('Token expired.');
                  this.refreshTokenService.getAccessToken(refreshToken)
                    .subscribe((data: {accessToken: string}) => {
                      if (data.accessToken) {
                        localStorage.setItem('accessToken', data.accessToken);
                        this.ngOnInit();
                      }
                    });
                }
          });
        } else {
          this.users = []
        }
        this.showMess = true;
      }, (error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          console.log('Token expired.');
          this.refreshTokenService.getAccessToken(refreshToken)
            .subscribe((data: {accessToken: string}) => {
              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                this.ngOnInit();
              }
            });
        }
      });
  }

  getLastMessages() {
    for (let f of this.users) {
      for (let i = this.messages.length - 1; i>=0; i--) {
        const m = this.messages[i];
        if (m.s_id === f.id || m.r_id === f.id) {
          const tim = (new Date(m.dts).toISOString()).split('T')[1].substring(0, 5);
          this.lastMessages[f.id] = {msg: m.msg, dts: tim, seen: m.seen};
          break;
        }
      }
    }
  }

  selectFriend(userId: number) {
    this.selectedFriend = userId;
  }

  onSend(form: NgForm) {
    const date = new Date().toISOString().split('.')[0];
    this.socket.emit('chat message', {'msg': form.value.message, 's_id': this.myId, 'r_id': this.selectedFriend, 'dts': date});
    this.messages.push({msg: form.value.message, s_id: this.myId + '', r_id: this.selectedFriend + '', dts: date});
    form.reset();
  }

  ngOnDestroy() {
    this.socket.emit('leave', this.myId);
    this.socket.disconnect();
  }

}
