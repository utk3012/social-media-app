import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../models/Post.model';
import { GetInfoService } from '../../../services/get-info.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Input() myId: number;

  constructor(private getInfoService: GetInfoService) { }

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
        console.log(error);
      });
  }

}
