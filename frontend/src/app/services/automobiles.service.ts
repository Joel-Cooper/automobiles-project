import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Automobile } from '../model/automobile.type';

@Injectable({
  providedIn: 'root'
})
export class AutomobilesService {
  http = inject(HttpClient);
  
  addAutomobile(newAutomobile: any) {
    const url = 'https://automobiles-project.onrender.com/add/automobile';
    return this.http.post<{ message: string }>(url, newAutomobile, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAutomobilesFromApi() {
    const url = 'https://automobiles-project.onrender.com/automobiles';
    return this.http.get<{ data: Array<Automobile> }>(url);
  }
}
