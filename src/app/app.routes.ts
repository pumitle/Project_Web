import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    {path:'',component:MainComponent},
    {path:'login' ,component:LoginComponent},
    {path:'signin' ,component:RegisterComponent}
];
