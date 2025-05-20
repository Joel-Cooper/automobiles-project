import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./home/home.component').then((m) => m.HomeComponent);
        },
    },
    {
        path: 'automobiles',
        loadComponent: () => {
            return import('./data-display/data-display.component').then((m) => m.DataDisplayComponent);
        },
    },
];
