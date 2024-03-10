import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MysqlService } from '../app/../../mysql.service'; 
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { UserResponese } from '../../Modeldatabase/user_get';
import { lastValueFrom } from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import {Router } from '@angular/router';
import { AuthenticationService } from '../../authen.service';
import {  SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,HttpClientModule,MatButtonModule,SlickCarouselModule,MatFormFieldModule,MatSelectModule ],

  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
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

@ViewChild('slickModal') slickModal: SlickCarouselComponent | undefined;

slickConfig = {
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 3,
  arrows: false,
  dots: true,
  autoplay: true,
  autoplaySpeed: 3000,
  variableWidth: false,
};


images = [
  { src: '/assets/imges/2023-Porsche-Mission-X-Concept-001-1080.jpg' },
  { src: '/assets/imges/2021-Nissan-GT-R50-by-Italdesign-003-2160.jpg' },
  { src: 'https://www.wsupercars.com/wallpapers-regular/Alfa-Romeo/2024-Alfa-Romeo-33-Stradale-001-1080.jpg' },
  { src: 'https://www.wsupercars.com/wallpapers-regular/Ferrari/2023-Ferrari-812-Competizione-Tailor-Made-001-1080.jpg' },
  { src: 'https://www.wsupercars.com/wallpapers-regular/Lamborghini/2023-Lamborghini-Lanzador-Concept-001-1080.jpg' },
 
];

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

goToprank(): void {
  this.router.navigate(['/toprank']);
}


}


