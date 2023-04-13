import { Component, NgModule, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angularApp';

  username: string;
  constructor(private http: HttpClient) {};

  ngOnInit() {
    this.http.get('/get-user').subscribe(
      (data: any) => this.username = data.username,
      (err: any) => {}
    )
  }
}
