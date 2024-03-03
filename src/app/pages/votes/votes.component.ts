import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MysqlService } from '../app/../../mysql.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserResponese, UploadRes } from '../../Modeldatabase/user_get';
import { lastValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../authen.service';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-votes',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, HttpClientModule, MatButtonModule, SlickCarouselModule],
  templateUrl: './votes.component.html',
  styleUrl: './votes.component.scss'
})
export class VotesComponent implements OnInit {
  
  


  logout() {
    throw new Error('Method not implemented.');
  }
  user: UserResponese | undefined;
  data: UploadRes[] = [];
  uid: any;

  selectedImage: any | null = null;
  selectImageId: any;
  imageId: any;
  images: any;
  selectScore:any;
  unselect: any;
  UnselectScore: any;

  winnerNewScore :number | undefined;
  loserNewScore :number | undefined;
  winnerScore:number | undefined;
  loserScore: number | undefined;

  constructor(private http: HttpClient, private activateRoute: ActivatedRoute, private mysqlService: MysqlService, private authService: AuthenticationService) { }

   ngOnInit(): void {
    this.authService.initializeAuthentication().then(user => {
      console.log('User data:', user);
      if (user) {
        console.log('User authenticated:', user);
        this.user = user;
        this.loadDataAsync();
       
      } else {
        console.log('User not authenticated');

      }
    });

  }


  async loadDataAsync() {
    this.data = await this.mysqlService.getdataupload();
    this.shuffleImages(this.data);
    console.log("Shuffled Data:", this.data);
    console.log("data is ", this.data);
  }

  

  async shuffleImages(images: any[]) {
    const uniqueIds = new Set<number>();
    const votedPairs = new Set<string>();
    const getPairKey = (index1: number, index2: number) => `${images[index1].upid}-${images[index2].upid}`;
  
    for (let i = images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [images[i], images[j]] = [images[j], images[i]];
    }
  
    for (let i = 0; i < images.length - 1; i += 2) {
      let swapped = false;
  
      do {
        if (images[i].upid !== images[i + 1].upid && !uniqueIds.has(images[i].upid) && !uniqueIds.has(images[i + 1].upid)) {
          const pairKey = getPairKey(i, i + 1);
          if (!votedPairs.has(pairKey)) {
            swapped = true;
            votedPairs.add(pairKey);
            uniqueIds.add(images[i].upid);
            uniqueIds.add(images[i + 1].upid);
          } else {
            const j = (i + 2) % images.length;
            [images[i + 1], images[j]] = [images[j], images[i + 1]];
            await this.delay(0); // Introduce a delay to allow the UI to update
          }
        } else {
          const j = (i + 2) % images.length;
          [images[i + 1], images[j]] = [images[j], images[i + 1]];
          await this.delay(0); // Introduce a delay to allow the UI to update
        }
      } while (!swapped);
    }
  }
  

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  


  selectImage(side: string, item: any, index: number, imageId: any, score: number, Unselectscore: number,unselectedImage: any): void {
    this.selectedImage = side;
    this.selectImageId = imageId;
    this.selectScore = score;
    this.UnselectScore = Unselectscore;
    this.unselect = unselectedImage;
   
    // เรียกใช้ calvote และส่ง imageId ไป
    this.calvote(this.selectImageId,this.unselect,this.selectScore,this.UnselectScore);
    console.log("Unimgid", this.unselect );
    console.log("selectid", this.selectImageId);
    console.log("score", this.selectScore);
    console.log("Unselectscore", this.UnselectScore);
    
  }


  async insertvote(selectImageId: any,UnselectImageId: any ,winscore : number,losescore : number) {
    // Assuming you have an API endpoint for voting
    const voteApiUrl = 'http://localhost:3000/voteapi/vote';

    try {
      // Assuming you have the user object available after authentication
      const user = this.user;


      if (user) { 

        const userId = user.uid;
        
        // Send a vote request to the server

    const responseWin  = await this.http.post(voteApiUrl, { user_fk_id: userId, up_fk_id: selectImageId, whowon: 1, score: winscore, vote_date: new Date() }).toPromise();
     

 
        // // Insert data for the non-selected image
    const responseLoser  = await this.http.post(voteApiUrl, {user_fk_id: userId,up_fk_id: UnselectImageId, whowon: 0, score: losescore,vote_date: new Date() }).toPromise();

   

    Swal.fire({
      icon: 'success',
      title: 'Vote Successful!',
      text: 'Thank you for voting.',
    });
    
    // Wait for 3 seconds before reloading the page
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Reload the page after a successful vote
    window.location.reload();
    
      } else {
        // Handle the case where the user data is not available
        console.error('User data not available');
        Swal.fire({
          icon: 'error',
          title: 'Vote Failed',
          text: 'User data not available. Please try again later.',
        });
      }
    } catch (error) {
      // Handle error if the vote request fails
      console.error('Vote failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Vote Failed',
        text: 'Please try again later.',
      });
    }
  }

  calculateEloRating(winnerScore: number, loserScore: number): { winnerNewScore: number, loserNewScore: number } {

  
    const k = 32; // factor
    const winnerExpectedScore = 1 / (1 + Math.pow(10, (loserScore - winnerScore) / 400));
    const loserExpectedScore = 1 / (1 + Math.pow(10, (winnerScore - loserScore) / 400));
  
    const winnerNewScore = winnerScore + k * (1 - winnerExpectedScore);
    const loserNewScore = loserScore + k * (0 - loserExpectedScore);
  
    console.log("New winner score:", winnerNewScore);
    console.log("New loser score:", loserNewScore);
    console.log("win", winnerNewScore);
    console.log("Lose", loserNewScore);
  
    return { winnerNewScore, loserNewScore };
  }
  
  calvote(winnerId: any, loserId: any, winnerScore: number, loserScore: number): void {
    // Assuming that you have access to the scores of the winner and loser
    winnerScore = this.selectScore || 0;
    loserScore = this.UnselectScore ? this.UnselectScore.score || 0 : 0;
  
    // Calculate Elo rating
    const { winnerNewScore, loserNewScore } = this.calculateEloRating(winnerScore, loserScore);
  
    this.insertvote(this.selectImageId, this.unselect, winnerNewScore, loserNewScore);
    console.log("Calculated winner score:", winnerNewScore);
    console.log("Calculated loser score:", loserNewScore);
  }
  

}





