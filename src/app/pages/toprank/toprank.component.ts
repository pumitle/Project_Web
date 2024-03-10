
import { CommonModule } from '@angular/common';
import { HttpClient ,HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MysqlService } from '../app/../../mysql.service'; 
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../../authen.service';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import {Router } from '@angular/router';
import { UserResponese } from '../../Modeldatabase/user_get';

@Component({
  selector: 'app-toprank',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,HttpClientModule,MatButtonModule],
  templateUrl: './toprank.component.html',
  styleUrl: './toprank.component.scss'
})
export class ToprankComponent {
  uid: any;
  user : UserResponese | undefined;
  constructor(private http :HttpClient,private activateRoute:ActivatedRoute,private mysqlService: MysqlService,private authService: AuthenticationService,private router:Router ) {}
  datauser: UserResponese[] = [];
  async ngOnInit()  {
    //   this.uid = this.activateRoute.snapshot.paramMap.get('uid') || '';
    //   console.log('uid',this.uid);
    //  this.datauser = await this.mysqlService.getById(this.uid);
    //  console.log('Main User',this.datauser);
     
    this.authService.initializeAuthentication().then(user => {
      console.log('User data:', user);
      if (user) {
        console.log('User authenticated:', user);
        this.user = user;
      } else {
        console.log('User not authenticated');
       
      }
    });
  }
  onSelectChange(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue === 'logout') {
      this.logout();
    }
    if (selectedValue === 'upload') {
      this.goUpload();
    }
    if (selectedValue === 'profile') {
      this.goProfile();
    }
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  goUpload(): void {
    this.router.navigate(['/upload']);
  }
  
  goProfile(): void {
    this.router.navigate(['/profile']);
  }

}
