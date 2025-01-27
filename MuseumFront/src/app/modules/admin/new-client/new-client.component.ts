import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import {
    FormBuilder,
    ReactiveFormsModule,
    Validators,
    type FormGroup,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject } from 'rxjs';

interface User {
    id: number;
    login: string;
    password: string;
    username: string;
}

@Component({
    selector: 'app-new-client',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatIconModule],
    templateUrl: './new-client.component.html',
})
export class NewClientComponent implements OnInit {
    private usersSubject = new BehaviorSubject<User[]>([
        { id: 1, login: '', password: '', username: '' },
        { id: 2, login: '', password: '', username: '' },
        { id: 3, login: '', password: '', username: '' },
    ]);
    users$ = this.usersSubject.asObservable();
    userForms: FormGroup[] = [];

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.usersSubject.value.forEach((user) => this.addUserForm(user));
    }

    addUserForm(
        user: Partial<User> = { login: '', password: '', username: '' }
    ) {
        const userForm = this.fb.group({
            login: [user.login, [Validators.required, Validators.minLength(3)]],
            password: [
                user.password,
                [Validators.required, Validators.minLength(6)],
            ],
            username: [user.login],
        });

        // Sync login and username
        userForm.get('login')?.valueChanges.subscribe((value) => {
            userForm.patchValue({ username: value }, { emitEvent: false });
        });

        this.userForms.push(userForm);
    }

    deleteUser(index: number) {
        this.userForms.splice(index, 1);
        const currentUsers = this.usersSubject.value.filter(
            (_, i) => i !== index
        );
        this.usersSubject.next(currentUsers);
    }

    saveUser(index: number) {
        const userForm = this.userForms[index];
        if (userForm.valid) {
            const updatedUser = {
                ...userForm.value,
                id: this.usersSubject.value[index]?.id || index + 1,
            };
            const currentUsers = [...this.usersSubject.value];
            currentUsers[index] = updatedUser;
            this.usersSubject.next(currentUsers);
            console.log('Saving user:', updatedUser);
        } else {
            this.handleFormError(userForm);
        }
    }

    saveAllUsers() {
        const validUsers = this.userForms
            .map((form, index) => {
                if (form.valid) {
                    return {
                        ...form.value,
                        id: this.usersSubject.value[index]?.id || index + 1,
                    };
                }
                return null;
            })
            .filter((user) => user !== null);

        if (validUsers.length === this.userForms.length) {
            this.usersSubject.next(validUsers);
            console.log('Saving all users:', validUsers);
        } else {
            console.error('Some user forms are invalid');
            this.userForms.forEach((form, index) => {
                if (!form.valid) {
                    console.log(
                        `Form at index ${index} is invalid:`,
                        this.getInvalidFields(form)
                    );
                }
                form.markAllAsTouched();
            });
        }
    }

    private getInvalidFields(form: FormGroup): { [key: string]: any } {
        const invalidFields: { [key: string]: any } = {};
        Object.keys(form.controls).forEach((key) => {
            const control = form.get(key);
            if (control && control.invalid) {
                invalidFields[key] = control.errors;
            }
        });
        return invalidFields;
    }

    private handleFormError(form: FormGroup) {
        console.error('User form is invalid');
        console.log('Invalid fields:', this.getInvalidFields(form));
        form.markAllAsTouched();
    }

    trackByIndex(index: number): number {
        return index;
    }
}
