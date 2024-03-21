import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthenticationGuard } from '../app/authen.guard';
import { UploadComponent } from './pages/upload/upload.component';
import { VotesComponent } from './pages/votes/votes.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ToprankComponent } from './pages/toprank/toprank.component';
import { DetailcarComponent } from './pages/detailcar/detailcar.component';
import { ShowprofileComponent } from './pages/showprofile/showprofile.component';
import { ListuserComponent } from './pages/listuser/listuser.component';


export const routes: Routes = [
    {path:'',component:MainComponent},
    { path: 'id/:uid', component: MainComponent, canActivate: [AuthenticationGuard]},
    {path:'login' ,component:LoginComponent},
    {path:'signin' ,component:RegisterComponent},
    {path:'upload',component:UploadComponent,canActivate: [AuthenticationGuard]},
    {path:'vote',component:VotesComponent},
    {path:'profile',component:ProfileComponent,canActivate: [AuthenticationGuard]},
    {path:'toprank',component:ToprankComponent},
    {path:'detailcar/:upid',component:DetailcarComponent,canActivate: [AuthenticationGuard]},
    {path:'showprofile',component:ShowprofileComponent,canActivate: [AuthenticationGuard]},
    {path:'listuser',component:ListuserComponent,canActivate: [AuthenticationGuard]}
    
];
