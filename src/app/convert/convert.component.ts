import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { NgForm } from '@angular/forms';
import { Courses } from '../interfaces/courses';
import { Currencies } from '../interfaces/currencies';

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.css'],
  providers: [HttpService]
})
export class ConvertComponent implements OnInit {

  currencies:any;
  courses:any;

  selectFirst:any;
  selectSecond:any;
  inputFirst:number;
  inputSecond:number;
  
  error:boolean = false;

  constructor(private httpService:HttpService) { }

  ngOnInit() {

    this.error = false;

    if (sessionStorage.getItem('courses')) {
      this.courses = JSON.parse(sessionStorage.getItem('courses'));
      this.currencies = JSON.parse(sessionStorage.getItem('currencies'));
    } else {
      this.httpService.getCourses().subscribe((data:Courses) => {
        if (data.success) {
          this.courses = data;
          sessionStorage.setItem('courses', JSON.stringify(data));
          if (!sessionStorage.getItem('currencies')) {
            this.httpService.getCurrencies().subscribe((data:Currencies) => {
              if (data.success) {
                this.currencies = [];
                let actualCurrencies:any = Object.keys(this.courses.rates);
                for (let currency in data.symbols) {
                  this.currencies.push({short: currency, long: data.symbols[currency]}); 
                }
                this.currencies = this.currencies.filter(item => {
                  return actualCurrencies.indexOf(item.short) !== -1 ? true : false;
                })
                sessionStorage.setItem('currencies', JSON.stringify(this.currencies));
              } else this.error = true;
            });
          }
        } else this.error = true;
      });
    }
  }

  changed(place:string):void {
    let from:string = place === 'first' ? this.selectFirst : this.selectSecond;
    let to:string = place !== 'first' ? this.selectFirst : this.selectSecond;
    let amount:number = place === 'first' ? +this.inputFirst : +this.inputSecond;
    if (!amount) {
      amount = place === 'first' ? +this.inputSecond : +this.inputFirst;
      place = place === 'first' ? 'second' : 'first';
      let temp = from;
      from = to;
      to = temp;
    }
    if (!from || !to || !amount || !this.isPositiveNumber(amount)) return;
    let rateFrom:number = +this.courses.rates[from];
    let rateTo:number = +this.courses.rates[to];
    let result:number = +(amount / rateFrom * rateTo).toFixed(3);
    if (place !== 'first') {
      this.inputFirst = result;
    } else this.inputSecond = result;
  }

  isPositiveNumber(num:number):boolean {
    return typeof num === 'number' && !isNaN(num) && isFinite(num) && num >= 0;
  }

  reset(place:string):void {
    if (place ==='first') {
      this.selectFirst = null;
      this.inputFirst = null;
    }
    else {
      this.selectSecond = null;
      this.inputSecond = null;
    }
  }
}