import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpService {

  private token:string = 'f4f9ecc4a80e2c6ca98b5eb12309feb7';
  private currencies:string = 'BYN,PLN,RUB,UAH,USD,EUR,GBP,BTC';

  constructor(private http:HttpClient) { }
  
  getCourses() {
    return this.http.get(`http://data.fixer.io/api/latest?access_key=${this.token}&symbols=${this.currencies}`);
  }

  getCurrencies() {
    return this.http.get(`http://data.fixer.io/api/symbols?access_key=${this.token}`);
  }
}