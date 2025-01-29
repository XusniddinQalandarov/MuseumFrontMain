import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        CommonModule,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
    ],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    isLoading: boolean = false; // To control spinner visibility

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['test@mail.ru', [Validators.required, Validators.email]],
            password: ['123', Validators.required],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            this.handleFormValidationErrors();
            return;
        }

        // Disable the form and show loading spinner
        this.signInForm.disable();
        this.isLoading = true;
        this.showAlert = false;

        // Sign in
        this._authService
            .signIn(this.signInForm.value)
            .pipe(
                // catchError((error) => {
                //     this.handleSignInError(error);
                //     return of(null); // Return observable with null to keep the stream alive
                // }),
                finalize(() => {
                    // Re-enable the form and hide loading spinner
                    this.signInForm.enable();
                    this.isLoading = false;
                })
            )
            .subscribe((response) => {
                if (response) {
                    // Set the redirect url.
                    const redirectURL =
                        this._activatedRoute.snapshot.queryParamMap.get(
                            'redirectURL'
                        ) || '/signed-in-redirect';

                    // Navigate to the redirect url
                    this._router
                        .navigateByUrl(redirectURL)
                        .catch((navError) => {
                            console.error('Navigation error:', navError);
                            this.handleNavigationError(navError);
                        });
                }
            });
    }

    /**
     * Handle form validation errors
     */
    private handleFormValidationErrors(): void {
        this.showAlert = true;
        this.alert = {
            type: 'error',
            message: 'Please fill in all required fields correctly.',
        };
        // Mark all fields as touched to display validation errors
        this.signInForm.markAllAsTouched();
    }

    /**
     * Handle sign in errors
     * @param error The error response
     */
    private handleSignInError(error: any): void {
        console.error('Sign in error:', error);
        if (error.name === 'AbortError') {
            this.alert = {
                type: 'error',
                message: 'The sign-in request was aborted. Please try again.',
            };
        } else if (error.status === 401) {
            this.alert = {
                type: 'error',
                message: 'Incorrect email or password.',
            };
        } else {
            this.alert = {
                type: 'error',
                message:
                    'An unexpected error occurred. Please try again later.',
            };
        }

        this.showAlert = true;
    }

    /**
     * Handle navigation errors
     * @param error The navigation error
     */
    private handleNavigationError(error: any): void {
        this.alert = {
            type: 'error',
            message: 'Navigation failed. Please try again.',
        };
        this.showAlert = true;
    }
}
