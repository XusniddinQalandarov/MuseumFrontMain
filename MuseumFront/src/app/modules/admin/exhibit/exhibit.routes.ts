import { Routes } from '@angular/router';
import { ExhibitComponent } from 'app/modules/admin/exhibit/exhibit.component';

export default [
    {
        path: '',
        component: ExhibitComponent,
    },
    {
        path: 'new-exhibit',
        loadComponent: () =>
            import('app/modules/admin/new-exhibit/new-exhibit.component').then(
                (m) => m.NewExhibitComponent
            ),
    },
    {
        path: 'new-client',
        loadComponent: () =>
            import('app/modules/admin/new-client/new-client.component').then(
                (m) => m.NewClientComponent
            ),
    },
] as Routes;
