import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  username: string;
  private http: HttpClient;

  ngOnInit() {
    this.http.get('/get-user').subscribe(
      (data: any) => this.username = data.username,
      (err: any) => {}
    )
  }
}
