import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {
  content: Observable<any[]>;
  status: any;

  readonly ROOT_URL = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient){}

  ngOnInit(): void {
    
  }
}
