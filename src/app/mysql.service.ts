import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { Dbconn } from '../../src/app/config/dbconn';
import { HttpClient } from '@angular/common/http';
import { UserResponese } from './Modeldatabase/user_get';
import {  UploadRes,ValueX } from './Modeldatabase/user_get';


@Injectable({
  providedIn: 'root',
})
export class MysqlService {
 
  constructor(private http: HttpClient , private conn: Dbconn) { }
  datauser: UserResponese[] = [];
  

 //เรียกข้อมูลผู้ใช้ตามไอดี
  public async getById(id: number,option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/user/${id}`);
   const response = await lastValueFrom(this.http.get(url));
   return response as UserResponese[];
  }



   //เรียกข้อมูลผู้ใช้ทั้งหมด ของรถแต่ละคัน 
  public async getdataupload(option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/dataup`);
   const response = await lastValueFrom(this.http.get(url));
   return response as  UploadRes[];
  }

    //เรียกข้อมูลรถทั้งหมด เรียงตามคะแนนรถ มากไปน้อย
  public async getdataAllupload(option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/dataup/detail`);
   const response = await lastValueFrom(this.http.get(url));
   return response as  UploadRes[];
  }


  //Rankทั้งหมด ของรถ วันนี้
  public async getdataAllrank(option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/dataup/rankalldetail`);
   const response = await lastValueFrom(this.http.get(url));
   return response as  UploadRes[];
  }

    //Rankทั้งหมด ของรถ เมื่อวาน
  public async getBefordataupload(option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/befor/befordate`);
   const response = await lastValueFrom(this.http.get(url));
   return response as  UploadRes[];
  }

      ///ดึงข้อมูลของรถ อันดับ 1แค่คันเดียว คะแนนรวมปัจจุบัน
  public async getNoonecar(option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/dataup/noone`);
   const response = await lastValueFrom(this.http.get(url));
   return response as  UploadRes[];
  }

      ///ดึงข้อมูลของรถ แค่คันเดียว คะแนนรวมปัจจุบัน
  public async getCarsbyId(id: number,option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/dataup/detailcar/${id}`);
   const response = await lastValueFrom(this.http.get(url));
   return response as  UploadRes[];
  }

    ///ดึงข้อมูลของรถ ข้อมูลกราฟ 7 วันย้อนหลัง
  public async getdataCarsbyId(id: number,option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/dataup/rewind/${id}`);
   const response = await lastValueFrom(this.http.get(url));
   return response as  UploadRes[];
  }

  ///ดึงข้อมูลของผู้ใช้ตามไอดี ข้อมูลโปร์ไฟล์
  public async getProfilebyId(id: number,option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/user/profile/${id}`);
   const response = await lastValueFrom(this.http.get(url));
   return response as  UploadRes[];
  }

  ///rank วันนี้
  public async getranktoday(option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/dataup/top10rank`);
   const response = await lastValueFrom(this.http.get(url));
   return response as  UploadRes[];
  }

  ///rank เมื่อวาน
  public async getrankbefor(option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/befor/top10rankbefor`);
   const response = await lastValueFrom(this.http.get(url));
   return response as  UploadRes[];
  }

  //ลบลถของรถคั้นนั้น
  public async deleteCars(id: number,option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/user/del/${id}`);
   const response = await lastValueFrom(this.http.delete(url));
   return response as  UploadRes[];
  }

  // เรียกค่า X
  public async getX(id: number,option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/user/valuex/${id}`);
   const response = await lastValueFrom(this.http.get(url));
   return response as ValueX[];
  }
// เรียกผู้ใช้ทั้งหมด หน้าแอดมิน
  public async getUser(option? :any) {
    const url = (`${this.conn.API_ENDPOINT}/dataup/userAll`);
   const response = await lastValueFrom(this.http.get(url));
   return response as UserResponese[];
  }
 
  // ค้นหาข้อมูลผู้ใช้ตามชื่อ
  public async searchuser(id: number, name: string, option?: any) {
    let url = `${this.conn.API_ENDPOINT}/dataup/search?`;
  
    // เรียกใช้งานเงื่อนไข option ถ้ามีการส่งค่า option เข้ามา
    if (option) {
      url += `id=${id}&name=${name}`;
    } else {
      url += `name=${name}`;
    }
  
    const response = await lastValueFrom(this.http.get(url));
    return response as UserResponese[];
  }
  

}
