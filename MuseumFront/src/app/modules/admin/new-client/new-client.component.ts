import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject } from 'rxjs';

interface User {
    id: number;
    login: string;
    password: string;
}

@Component({
    selector: 'app-new-client',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatIconModule],
    templateUrl: './new-client.component.html',
})
export class NewClientComponent {
    private usersSubject = new BehaviorSubject<User[]>([
        { id: 1, login: '', password: '' },
        { id: 2, login: '', password: '' },
        { id: 3, login: '', password: '' },
    ]);
    users$ = this.usersSubject.asObservable();
    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            users: this.fb.array([]),
        });

        // Initialize form with users
        this.usersSubject.value.forEach(() => {
            this.addUser();
        });
    }

    get users() {
        return this.form.get('users') as FormArray;
    }

    addUser() {
        const userGroup = this.fb.group({
            login: [''],
            password: [''],
        });
        this.users.push(userGroup);
    }

    deleteUser(index: number) {
        this.users.removeAt(index);
        const currentUsers = this.usersSubject.value.filter(
            (_, i) => i !== index
        );
        this.usersSubject.next(currentUsers);
    }

    saveUsers() {
        if (this.form.valid) {
            const formUsers = this.form.value.users;
            const updatedUsers = formUsers.map((user: any, index: number) => ({
                ...user,
                id: this.usersSubject.value[index]?.id || index + 1,
            }));
            this.usersSubject.next(updatedUsers);
            console.log('Saving users:', updatedUsers);
        }
    }
}
