import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/Services/User/user.service';
import { AirlinesComponent } from './airlines/airlines.component';
import { SearchComponent } from './search/search.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MatGridListModule } from '@angular/material/grid-list';
import { AirlinesSearchComponent } from './airlines-search/airlines-search.component';
import { FriendsComponent } from './friends/friends.component';
import { RouterModule } from '@angular/router';
import { ProfileShowComponent } from './profile-show/profile-show.component';
import { FlightComponent } from './flight/flight.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { FlightsFilterComponent } from './flights-filter/flights-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AirlinesComponent,
    SearchComponent,
    AirlinesSearchComponent,
    FriendsComponent,
    ProfileShowComponent,
    FlightComponent,
    SignUpComponent,
    HomeComponent,
    FlightsFilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'friends', component: FriendsComponent},
      { path: 'profile/show', component: ProfileShowComponent},
      { path: 'airlines', component : AirlinesSearchComponent},
      { path: 'sign-in', component: SignInComponent},
      { path: 'sign-up', component: SignUpComponent},
      { path: 'flights', component: FlightsFilterComponent}
    ])
  ],
  providers: [
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
