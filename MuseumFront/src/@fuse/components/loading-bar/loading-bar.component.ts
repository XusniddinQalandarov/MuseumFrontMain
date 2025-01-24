import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgZone,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FuseLoadingService } from '@fuse/services/loading';
import { Observable } from 'rxjs';

@Component({
    selector: 'fuse-loading-bar',
    template: `
        <mat-progress-bar
            [mode]="mode$ | async"
            [value]="progress$ | async"
            *ngIf="show$ | async"
        >
        </mat-progress-bar>
    `,
    styleUrls: ['./loading-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'fuseLoadingBar',
    standalone: true,
    imports: [MatProgressBarModule, AsyncPipe, CommonModule],
})
export class FuseLoadingBarComponent implements OnChanges, OnInit {
    private _fuseLoadingService = inject(FuseLoadingService);
    private _ngZone = inject(NgZone);

    @Input() set autoMode(value: boolean) {
        this._ngZone.run(() => {
            this._fuseLoadingService.setAutoMode(coerceBooleanProperty(value));
        });
    }

    mode$: Observable<'determinate' | 'indeterminate'>;
    progress$: Observable<number>;
    show$: Observable<boolean>;

    ngOnInit(): void {
        this.mode$ = this._fuseLoadingService.mode$;
        this.progress$ = this._fuseLoadingService.progress$;
        this.show$ = this._fuseLoadingService.show$;
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Auto mode
        if ('autoMode' in changes) {
            this.autoMode = changes.autoMode.currentValue;
        }
    }
}
