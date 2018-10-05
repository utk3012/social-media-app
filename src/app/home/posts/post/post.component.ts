import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../models/Post.model';
import { GetInfoService } from '../../../services/get-info.service';
import { RefreshTokenService } from '../../../services/refresh-token.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Input() myId: number;

  constructor(private getInfoService: GetInfoService, private refreshTokenService: RefreshTokenService) { }

  ngOnInit() {
  }

  onLike(post_id: number) {
    const accessToken = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    this.getInfoService.onLike({username: username, post_id: post_id}, accessToken)
      .subscribe((data: {success: number}) => {
        if (data.success === 1) {
          const index: number = this.post.liked.indexOf(this.myId);
          if (index === -1) {
            this.post.liked.push(this.myId);
          }
          else {
            this.post.liked.splice(index, 1);
          }
        }
      }, (error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
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

}
