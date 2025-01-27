import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'exhibit',
    standalone: true,
    imports: [MatIconModule, RouterModule],
    templateUrl: './exhibit.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ExhibitComponent {
    constructor() {}
}
