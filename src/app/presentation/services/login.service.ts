import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";

@Injectable({providedIn:'root'})

export class loginServices {

    private ServerURL=environment.apiurl; //url de la api backend

    constructor(private http:HttpClient) {}

    register(name:string,email:string,password:string): Observable<any> {
        return this.http.post(`${this.ServerURL}/user/register`,{name,email,password},{withCredentials:true});
    }

    login(email:string,password:string): Observable<any> {
        return this.http.post(`${this.ServerURL}/user/login`,{email,password},{withCredentials:true});
    }

    logout():Observable<any>{
        return this.http.post(`${this.ServerURL}/user/logout`,{},{withCredentials:true})
    }

    

    



}