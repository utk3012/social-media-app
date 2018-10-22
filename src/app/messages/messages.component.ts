import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
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
      .subscribe((dat: {success: number, data: any}) => {
        if (dat.success === 1) {
          this.users = dat.data;
          this.getInfoService.getMessages({username: this.username, dts: '2018-09-23T10:01:00'}, accessToken)
            .subscribe((res: any) => {
                this.messages = res.data;
                this.myId = res.myid;
                this.getLastMessages();
                this.socket.emit('join', this.myId);
                this.socket.on('chat message', function(msg: any) {
                  this.messages.push({msg: msg.msg, s_id: msg.s_id + '', r_id: msg.r_id + '', seen: msg.seen, dts: msg.dts});
                  this.scrollToBottom();
                }.bind(this));
                // this.checkUnseen();
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
      for (let m of this.messages) {
        if (m.s_id === f.id) {
          const tim = (new Date(m.dts).getHours()) + ':' + (new Date(m.dts).getMinutes());
          // this.lastMessages.push({msg: m.msg, id: f.id, dts: tim});
          this.lastMessages[m.s_id] = {msg: m.msg, dts: tim, seen: m.seen};
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
    this.scrollToBottom();
    form.reset();
  }

  scrollToBottom() {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  ngOnDestroy() {
    this.socket.emit('leave', this.myId);
    this.socket.disconnect();
  }

}
