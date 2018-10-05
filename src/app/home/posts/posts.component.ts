import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../models/Post.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  @Input() posts: Post[];
  @Input() myId: number;

  constructor() { }

  ngOnInit() {
  }

}
