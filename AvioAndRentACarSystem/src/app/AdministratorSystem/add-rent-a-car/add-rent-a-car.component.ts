import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/AirlineModel/user';
import { UserRole } from 'src/app/AirlineModel/userRole';
import { AdministratorRacModalComponent } from 'src/app/ModalsRAC/administrator-rac-modal/administrator-rac-modal.component';
import { BranchesModalComponent } from 'src/app/ModalsRAC/branches-modal/branches-modal.component';
import { AdminRACUser } from 'src/app/ModelRAC/adminRACUser';
import { RACAddress } from 'src/app/ModelRAC/racAddress';
import { RACService } from 'src/app/ModelRAC/racService';
import { AdminRacUserService } from 'src/app/Services/AdminRACUser/admin-rac-user.service';
import { LoginService } from 'src/app/Services/Login/login.service';
import { RacAddressService } from 'src/app/Services/RACAddress/rac-address.service';
import { RacServiceService } from 'src/app/Services/RACService/rac-service.service';
import { UserService } from 'src/app/Services/User/user.service';

@Component({
  selector: 'app-add-rent-a-car',
  templateUrl: './add-rent-a-car.component.html',
  styleUrls: ['./add-rent-a-car.component.css']
})
export class AddRentACarComponent implements OnInit {

  @Output() change = new EventEmitter<boolean>();

  public priceListForOne: number;
  public priceListForTwo: number;
  public priceListForThree: number;
  public priceListForFour: number;
  public priceListForMore: number;

  public allUsers: Array<User>;
  public userId: number;
  public allRAC: Array<RACService>;
  public racId: number;
  public rac: RACService;
  public loginService: LoginService;
  public racAddresses: Array<RACAddress>;
  public address: RACAddress;
  public racAdministrator: User;
  public mainAddress: RACAddress;
  public message: string;
  get UserRole() { return UserRole; }

  constructor(private adminRACUserService: AdminRacUserService, private modalService: NgbModal, private activatedRoute: ActivatedRoute, loginService: LoginService, private racServiceService: RacServiceService, private racAddressService: RacAddressService, private userService: UserService) {
    this.rac = new RACService();
    this.racAddresses = new Array<RACAddress>();
    this.mainAddress = new RACAddress();
    this.racAdministrator = new User();
    this.racId = 0;
    this.userId = 0;
    this.loginService = loginService;
  }

  ngOnInit(): void {
    this.userService.getAll().subscribe(res => {
      this.allUsers = res as Array<User>;
    });

    this.racServiceService.getAll().subscribe(res => {
      this.allRAC = res as Array<RACService>;
    });
  }

  addRAC() {
    if(this.checkInput()){
      if (confirm('Are you sure you want to save this service?')) {
        this.rac.rating = 0;
        this.rac.priceList = "For one person " + this.priceListForOne + "€\n"+
                             "For two persons " + this.priceListForTwo + "€\n"+
                             "For three persons " + this.priceListForThree + "€\n"+
                             "For four persons " + this.priceListForFour + "€\n"+
                             "For more persons " + this.priceListForMore + "€"
        ;
  
        this.racServiceService.add(this.rac).subscribe(ret => {
          let retRAC = ret as RACService;
          this.userService.add(this.racAdministrator).subscribe(ret => {
            let retAdmin = ret as AdminRACUser;
            /*
            //PRONALAZIM NAJVECI ID UNUTAR LISTE RAC SERVISA KAKO SE NE BI POTREFILO DA BUDU 2 SA ISTIM ID-JEM
            this.allRAC.forEach(element => {
              if(element.id > this.racId)
                this.racId = element.id;
            });
            */
            //this.mainAddress.racServiceId = this.racId + 1;
            this.mainAddress.racServiceId = retRAC.id;
            this.mainAddress.isMain = true;
            this.racAddressService.add(this.mainAddress).subscribe(() => {
              this.racAddresses.forEach(element => {
                element.racServiceId = retRAC.id;
                element.isMain = false;
                this.racAddressService.add(element).subscribe(() => {
                  /*
                  //PRONALAZIM NAJVECI ID UNUTAR LISTE USER-A KAKO SE NE BI POTREFILO DA BUDU 2 SA ISTIM ID-JEM
                  this.allUsers.forEach(element => {
                    if(element.id > this.userId)
                      this.userId = element.id;
                  });
                  */
                    
                });
              });

              var adminRACUser = new AdminRACUser();
              adminRACUser.id = retAdmin.id;
              adminRACUser.racServiceId = retRAC.id;
              this.adminRACUserService.add(adminRACUser).subscribe(() => {
                alert("Service is saved successfuly.")
                this.deleteAdmin();
                this.change.emit(true);
              });
            });
          }); 
        }); 
      }
    }
    else
      alert(this.message);
  }

  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.rac.logo = event.target.result.toString();
      }
    }
  }

  openAdministratorRACModal(){
    if(this.loginService.userRole == UserRole.AdminSys){
      const modalRef = this.modalService.open(AdministratorRacModalComponent);
      modalRef.componentInstance.racAdministrator = this.racAdministrator;
      modalRef.result.then((result) => {
        if (result) {
          this.racAdministrator = result;
          console.log(result);
        }
      }, (reason) => {
        console.log(reason);
      });
    }
  }

  openBranchesModal(){
    if(this.loginService.userRole == UserRole.AdminSys){
      this.address = new RACAddress();
      const modalRef = this.modalService.open(BranchesModalComponent);
      modalRef.componentInstance.address = this.address;
      modalRef.result.then((result) => {
        if (result) {
          this.address = result;
          console.log(result);
          this.racAddresses.push(this.address)
        }
      }, (reason) => {
        console.log(reason);
      });
    } 
  }

  deleteAddress(index: number){
    this.racAddresses.splice(index,1);
  }

  deleteAdmin(){
    this.racAdministrator = new User();
  }

  checkInput():boolean{
    if(this.rac.logo=="" || this.rac.logo ==undefined || 
       this.rac.name=="" || this.rac.name==undefined || 
       this.rac.promotionalDescription=="" || this.rac.promotionalDescription==undefined || 
       this.mainAddress.city=="" || this.mainAddress.city==undefined || 
       this.mainAddress.country=="" || this.mainAddress.country==undefined || 
       this.mainAddress.number==undefined || this.mainAddress.number <= 0 || this.mainAddress.number > 10000 || 
       this.mainAddress.street=="" || this.mainAddress.street==undefined || 
       this.racAdministrator.username=="" || this.racAdministrator.username==undefined || 
       this.racAdministrator.email=="" || this.racAdministrator.email==undefined || 
       this.racAdministrator.firstName=="" || this.racAdministrator.firstName==undefined || 
       this.racAdministrator.lastName=="" || this.racAdministrator.lastName==undefined || 
       this.racAdministrator.mobileNumber=="" || this.racAdministrator.mobileNumber==undefined || 
       this.racAdministrator.password=="" || this.racAdministrator.password==undefined){
      this.message = "Bad input. All fields must be provided.";
      return false;
    }
    return true
  }
}