import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserResponese } from './Modeldatabase/user_get';


@Injectable({
  providedIn: 'root',
})
export class MysqlService {
  private apiUrl = 'http://localhost:3000/api/mysql-data'; // เปลี่ยนเป็น URL ของ API ของคุณ

  constructor(private http: HttpClient) { }
  datauser: UserResponese[] = [];
  
  async getData() {
    const url = 'http://localhost:3000/api/mysql-data' ;
    let data = await lastValueFrom(this.http.get(url));
    this.datauser = data as UserResponese[];
    console.log(this.datauser[0].name);
    console.log('Call Completed');
  }


}
