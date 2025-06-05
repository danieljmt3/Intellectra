import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpenAiService {
  private apiURL = 'http://localhost:3000'; // URL del backend

  constructor(private http: HttpClient) {}

  correctaescritura(text: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/corregir-ort`, { prompt: text });
  }

  traducir(prompt: string, lenbase: string, lenobjet: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/traducir`, {
      prompt,
      lenbase,
      lenobjet,
    });
  }

  texttospeech(prompt: string, genero:string): Observable<Blob> {
    return this.http.post(`${this.apiURL}/textospeech`,{
      prompt,
      genero
    },{
      responseType:'blob'
    });
  }
}
