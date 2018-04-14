import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

interface TicketSlab {
  id?: number;
  date?: string;
  capital?: number;
  interest?: number;
  installment?: number;
  outstanding?: number;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public interest: number = 0;
  public capitalAmount: number = 0;
  public currentCapital: number;
  public installments: number = 0;
  public schedule: TicketSlab[];

  public fixedFact: number;

  constructor(public navCtrl: NavController) {

  }

  clear(): void {
    this.interest = 0;
    this.installments = 0;
    this.capitalAmount = 0;
    this.schedule = [];
  }

  calculate(): void {
    let sumIFact: number = 0;

    var val = this.interest / 100;
    var rate = val / 12;

    for (let i = 0; i < this.installments; i++) {
      let slabI: number = 1 / Math.pow((1 + rate), (this.installments - i));
      sumIFact = sumIFact + slabI;
    }

    this.schedule = [];
    this.fixedFact = (this.capitalAmount / sumIFact);

    let outstanding: number = this.capitalAmount;
    this.currentCapital = this.capitalAmount;

    for (let i = 1; i <= this.installments; i++) {

      let slab: TicketSlab = {};
      slab.id = i;
      slab.installment = this.fixedFact;
      slab.interest = this.currentCapital * val / 12;
      slab.capital = slab.installment - (this.currentCapital * rate);
      outstanding = this.currentCapital - slab.capital;
      slab.outstanding = outstanding;

      //current outstanding is the next opening value
      this.currentCapital = outstanding;

      let day = new Date;
      day.setMonth(day.getMonth() + i);
      slab.date = day.toISOString();

      this.schedule.push(slab);
    }
  }
}
