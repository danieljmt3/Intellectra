import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({providedIn:'root'})

export class passwordRestServices{
    private ServerURL="http://localhost:3000/intellectra"; //url de la api backend

    constructor(private http:HttpClient) {}


    requestRestPassword(email:string): Observable<any> {
        return this.http.post(`${this.ServerURL}/request-passw`,{email})
    }

    RestPassword(id:string,token:string,NewPassword:string): Observable<any> {
        return this.http.post(`${this.ServerURL}/reset-passw?id=${id}&token=${token}`,{NewPassword})
    }
}