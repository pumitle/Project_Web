import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Dbconn } from '../../src/app/config/dbconn';
import { HttpClient } from '@angular/common/http';
import { UserResponese } from './Modeldatabase/user_get';
import {  UploadRes } from './Modeldatabase/user_get';


@Injectable({
  providedIn: 'root',
})
export class MysqlService {
 
  constructor(private http: HttpClient , private conn: Dbconn) { }
  datauser: UserResponese[] = [];
  

 
  public async getById(id: number,option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/user/${id}`);
   const response = await lastValueFrom(this.http.get(url));
   return response as UserResponese[];
  }



  public async getdataupload(option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/dataup`);
   const response = await lastValueFrom(this.http.get(url));
   return response as  UploadRes[];
  }

  public async getdataAllupload(option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/dataup/detail`);
   const response = await lastValueFrom(this.http.get(url));
   return response as  UploadRes[];
  }

  public async getBefordataupload(option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/befor/befordate`);
   const response = await lastValueFrom(this.http.get(url));
   return response as  UploadRes[];
  }


  
 

}
