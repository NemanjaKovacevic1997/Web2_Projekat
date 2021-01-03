import { Component, OnInit } from '@angular/core';
import { HistoryFlight } from '../AirlineModel/HelperModel/historyFlight';
import { Car } from '../ModelRAC/car';
import { RACAddress } from '../ModelRAC/racAddress';
import { RACService } from '../ModelRAC/racService';
import { Rent } from '../ModelRAC/rent';
import { CarService } from '../Services/Car/car.service';
import { LoginService } from '../Services/Login/login.service';
import { RacAddressService } from '../Services/RACAddress/rac-address.service';
import { RacServiceService } from '../Services/RACService/rac-service.service';
import { RentService } from '../Services/Rent/rent.service';
import { TicketService } from '../Services/Ticket/ticket.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  historys: Array<HistoryFlight>;
  rents: Array<Rent>;
  allRents: Array<Rent>;

  constructor(private loginService: LoginService, private ticketService: TicketService, private rentService: RentService, private racAddressService: RacAddressService, private carService: CarService, private racService: RacServiceService) { }

  ngOnInit(): void {
    let id = this.loginService.user.id;
    this.ticketService.userFlightHistory(id).subscribe(res => {
      this.historys = res as Array<HistoryFlight>;
    });

    this.rents = new Array<Rent>();
    this.rentService.getAll().subscribe(ret => {
      this.allRents = ret as Array<Rent>;
      this.allRents.forEach(element => {
        if(element.registeredUserId == id){
          this.racAddressService.get(element.startRACAddressId).subscribe(res => {
            element.startRACAddress = res as RACAddress;
            this.racAddressService.get(element.endRACAddressId).subscribe(res => {
              element.endRACAddress = res as RACAddress;
              this.carService.get(element.carId).subscribe(res => {
                element.car = res as Car;
                this.racService.get(element.car.racServiceId).subscribe(res => {
                  element.rac = res as RACService;
                  this.rents.push(element);
                });
              });
            });
          });
        }
      });
    });
  }

  dropRent(rent:Rent) {
    rent.car.rented = false;
    this.carService.update(rent.carId, rent.car).subscribe(()=>{
      this.rentService.remove(rent.id).subscribe(() => this.ngOnInit());
    });
  }

  racChangeRating(rent:Rent, newRatingForRACService: number) {
    let rac = rent.rac;
    let count = 0;
    let sumOfPoints = 0;
    this.allRents.forEach(element => {
      if(element.rac.id == rac.id && element.ratingForRACService != 0){
        count++;
      }
    });
    //AKO JE VEC OCENJEN, MORA DA SE POKUPI TA STARA OCENA I ODUZME OD UKUPNE SUME POENA
    this.rentService.get(rent.id).subscribe(res => {
      let temp = res as Rent;
      if(temp.ratingForRACService == 0)
        count--;
      sumOfPoints = count * rac.rating - temp.ratingForRACService;
      if(temp.ratingForRACService == 0)
        count++;
      rac.rating = (sumOfPoints + newRatingForRACService) / count;
      this.racService.update(rac.id, rac).subscribe(() => {
        rent.ratingForRACService = newRatingForRACService;
        this.rentService.update(rent.id, rent).subscribe(() => {
          this.ngOnInit();
        });
      });
    });
  }

  carChangeRating(rent:Rent, newRatingForCar: number) {
    let car = rent.car;
    let count = 0;
    let sumOfPoints = 0;
    this.allRents.forEach(element => {
      if(element.car.id == car.id && element.ratingForCar != 0){
        count++;
      }
    });
    //AKO JE VEC OCENJEN, MORA DA SE POKUPI TA STARA OCENA I ODUZME OD UKUPNE SUME POENA
    this.rentService.get(rent.id).subscribe(res => {
      let temp = res as Rent;
      if(temp.ratingForCar == 0)
        count--;
      sumOfPoints = count * car.rating - temp.ratingForCar;
      if(temp.ratingForCar == 0)
        count++;
      car.rating = (sumOfPoints + newRatingForCar) / count;
      this.carService.update(car.id, car).subscribe(() => {
        rent.ratingForCar = newRatingForCar;
        this.rentService.update(rent.id, rent).subscribe(() => {
          this.ngOnInit();
        });
      });
    });
  }

  is2DaysBeforeDelivery(startDate: Date): boolean {
    let now = new Date();
    let rentDate = new Date(startDate);
    rentDate.setDate(rentDate.getDate() - 2);

    console.log("now :" +  now + " : " + now.getTime());
    console.log("date :" + rentDate + " : " + rentDate.getTime());

    if(now.getTime() >= rentDate.getTime()){
      console.log("true");
      return false;
    }

    console.log("false");
    return true;
  }

  isFinished(endDate: Date): boolean {
    let now = new Date();
    let rentDate = new Date(endDate);

    console.log("now :" +  now + " : " + now.getTime());
    console.log("date :" + rentDate + " : " + rentDate.getTime());

    if(now.getTime() <= rentDate.getTime()){
      console.log("true");
      return false;
    }

    console.log("false");
    return true;
  }

  drop(ticketId: number) {
    this.ticketService.remove(ticketId).subscribe(() => this.ngOnInit());
  }

  isAfter3HoursBeforeFlight(day: number, month: number, year: number, hour: number, minute: number): boolean {
    let now = new Date();
    var date = new Date(year, month - 1, day, hour, minute, 0);

    date.setHours(date.getHours() - 3);

    console.log("now :" +  now + " : " + now.getTime());
    console.log("date :" + date + " : " + date.getTime());

    if(now.getTime() >= date.getTime()){
      console.log("true");
      return false;
    }

    console.log("false");
    return true;
  }
}
