import { Component, OnInit } from '@angular/core';
import { Airline } from '../AirlineModel/airline';
import { Address } from '../AirlineModel/address';
import { PriceList } from '../AirlineModel/priceList';
import { XYZ } from '../AdministratorAirline/airline-profile/airline';
import { Airport } from '../AirlineModel/airport';

@Component({
  selector: 'app-airline',
  templateUrl: './airline.component.html',
  styleUrls: ['./airline.component.css']
})
export class AirlineComponent implements OnInit {
  airline: Airline;

  constructor() { }

  ngOnInit(): void {
    this.airline = new Airline("MyAirline",
                                  new Address(0, "Belgrade", "Serbia", 44.81944444, 20.30694444),
                                  "Always with you",
                                  new PriceList(5, 12, 3, new XYZ(20, 10, 30)));

    this.airline.businessDestinations.push(new Airport("Nikola Tesla", new Address(0, "Belgrade", "Serbia", 44.81944444, 20.30694444)));
    this.airline.businessDestinations.push(new Airport("P.P. Njegos", new Address(0, "Podgorica", "Montenegro", 43.81944444, 19.30694444)));
    this.airline.businessDestinations.push(new Airport("Misa Tumbas", new Address(0, "Zagreb", "Croatia", 43.81944444, 19.30694444)));
  }
}
