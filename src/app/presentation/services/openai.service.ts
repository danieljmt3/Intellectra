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
}
