import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";

@Injectable({providedIn:'root'})

export class passwordRestServices{
    private ServerURL=environment.apiurl; //url de la api backend

    constructor(private http:HttpClient) {}


    requestRestPassword(email:string): Observable<any> {
        return this.http.post(`${this.ServerURL}/request-passw`,{email})
    }

    RestPassword(id:string,token:string,NewPassword:string): Observable<any> {
        return this.http.post(`${this.ServerURL}/reset-passw?id=${id}&token=${token}`,{NewPassword})
    }
}