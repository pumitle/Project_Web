import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Dbconn {
  public readonly API_ENDPOINT: string = 'https://adv-voote.onrender.com';
}