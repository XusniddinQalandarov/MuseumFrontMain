import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
@Component({
    selector: 'exhibit',
    standalone: true,
    imports: [MatIconModule],
    templateUrl: './exhibit.component.html',
    styleUrls: ['./exhibit.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ExhibitComponent {
    /**
     * Constructor
     */
    constructor() {}
}
