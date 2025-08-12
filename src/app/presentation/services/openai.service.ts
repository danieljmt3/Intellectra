import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpenAiService {
  private apiURL = 'http://localhost:3000/intellectra'; // URL del backend

  constructor(private http: HttpClient) {}

  private getAuthearder(){
    const token= localStorage.getItem('token');
    if(token){
      return {headers:new HttpHeaders().set('Authorization',`Bearer ${token}`)}
    }
    return {}
  }

  correctaescritura(text: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/corregir-ort`, { prompt: text },this.getAuthearder());
  }

  traducir(prompt: string, lenbase: string, lenobjet: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/traducir`, {
      prompt,
      lenbase,
      lenobjet,
    },this.getAuthearder());
  }

  texttospeech(prompt: string, genero:string): Observable<Blob> {
    return this.http.post(`${this.apiURL}/textospeech`,{
      prompt,
      genero
    },{
      responseType:'blob',
      ...this.getAuthearder()
    });
  }

  imagengeneration(prompt:string): Observable<Blob> {
    return this.http.post(`${this.apiURL}/imagengen`,{
      prompt
    },{
      responseType:'blob',
      ...this.getAuthearder()
    })
  }
}
