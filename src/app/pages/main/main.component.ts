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

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,HttpClientModule,MatButtonModule,SlickCarouselModule ],

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

logout(): void {
  this.authService.logout();
  this.router.navigate(['/login']);
}


}



////Ero

// class EloRating {
//   private static readonly K_FACTOR = 32;

//   // Function to calculate expected probability of winning
//   private static expectedProbability(ratingA: number, ratingB: number): number {
//     return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
//   }

//   // Function to calculate new ratings after a match
//   static updateRatings(ratingA: number, ratingB: number, outcome: number): { newRatingA: number; newRatingB: number } {
//     const expectedProbabilityA = EloRating.expectedProbability(ratingA, ratingB);
//     const expectedProbabilityB = EloRating.expectedProbability(ratingB, ratingA);

//     const actualOutcomeA = outcome === 1 ? 1 : 0; // 1 for win, 0 for loss
//     const actualOutcomeB = outcome === 0 ? 1 : 0; // 1 for win, 0 for loss

//     const newRatingA = ratingA + EloRating.K_FACTOR * (actualOutcomeA - expectedProbabilityA);
//     const newRatingB = ratingB + EloRating.K_FACTOR * (actualOutcomeB - expectedProbabilityB);

//     return { newRatingA, newRatingB };
//   }
// }

// // Example usage
// const playerARating = 1600;
// const playerBRating = 1500;
// const outcome = 1; // Assume player A wins the match

// const updatedRatings = EloRating.updateRatings(playerARating, playerBRating, outcome);
// console.log('New Rating for Player A:', updatedRatings.newRatingA);
// console.log('New Rating for Player B:', updatedRatings.newRatingB);
