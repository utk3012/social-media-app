import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { PostsComponent } from './home/posts/posts.component';
import { PostComponent } from './home/posts/post/post.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FriendsComponent } from './friends/friends.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RequestsComponent } from './requests/requests.component';
import { MessagesComponent } from './messages/messages.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DiscoverComponent } from './discover/discover.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MessagePipe } from './pipes/message.pipe';
import { AuthGuardService as AuthGuard } from './guards/auth-guard.service';

const appRoutes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard]},
  {path: 'friends', component: FriendsComponent, canActivate: [AuthGuard]},
  {path: 'messages', component: MessagesComponent, canActivate: [AuthGuard]},
  {path: 'friend-requests', component: RequestsComponent, canActivate: [AuthGuard]},
  {path: 'not-found', component: NotFoundComponent, canActivate: [AuthGuard]},
  {path: 'discover', component: DiscoverComponent, canActivate: [AuthGuard]},
  {path: ':username', component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    PostsComponent,
    PostComponent,
    NavbarComponent,
    FriendsComponent,
    NotificationsComponent,
    RequestsComponent,
    MessagesComponent,
    NotFoundComponent,
    DiscoverComponent,
    UserProfileComponent,
    MessagePipe
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
