import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('username') username: ElementRef;
  @ViewChild('password') password: ElementRef;
  error: string;

  constructor(private http: HttpClient) {};

  login() {
    const body = {
      username: this.username.nativeElement.value,
      password: this.password.nativeElement.value
    }

    this.http.post('/api/login', body, { observe: 'response' }).subscribe({
      next: (data) => window.location.replace('/'),
      error: (err) => this.error = err.error.message
    })
  }
}
