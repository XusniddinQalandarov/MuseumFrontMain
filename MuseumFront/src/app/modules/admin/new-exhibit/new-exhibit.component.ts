import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject, Subject } from 'rxjs';

interface LanguageSection {
    name: string;
    code: string;
    flag: string;
    imagePath: string;
}

@Component({
    selector: 'app-new-exhibit',
    templateUrl: './new-exhibit.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
    ],
})
export class NewExhibitComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private audioFiles$ = new BehaviorSubject<{ [key: string]: File | null }>(
        {}
    );

    exhibitForm: FormGroup;

    languages: LanguageSection[] = [
        {
            name: "O'zbekcha",
            code: 'uz',
            flag: '🇺🇿',
            imagePath: 'images/flags/uz.png',
        },
        {
            name: 'Русский',
            code: 'ru',
            flag: '🇷🇺',
            imagePath: 'images/flags/ru.png',
        },
        {
            name: 'English',
            code: 'en',
            flag: '🇺🇸',
            imagePath: 'images/flags/en.png',
        },
    ];

    displayedColumns: string[] = ['language', 'name', 'audio'];

    constructor(private fb: FormBuilder) {
        this.initializeForm();
    }

    private initializeForm(): void {
        const formGroup: any = {};

        this.languages.forEach((lang) => {
            formGroup[`name_${lang.code}`] = ['', [Validators.required]];
            formGroup[`description_${lang.code}`] = ['', [Validators.required]];
        });

        this.exhibitForm = this.fb.group(formGroup);
    }

    ngOnInit(): void {
        const initialAudioFiles = this.languages.reduce(
            (acc, lang) => {
                acc[lang.code] = null;
                return acc;
            },
            {} as { [key: string]: File | null }
        );
        this.audioFiles$.next(initialAudioFiles);
    }

    onAudioUpload(event: Event, languageCode: string): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const updatedFiles = {
                ...this.audioFiles$.value,
                [languageCode]: file,
            };
            this.audioFiles$.next(updatedFiles);
        }
    }

    getAudioFileName(languageCode: string): string {
        const file = this.audioFiles$.value[languageCode];
        return file ? file.name : '';
    }

    hasAudioFile(languageCode: string): boolean {
        return !!this.audioFiles$.value[languageCode];
    }

    saveExhibit(): void {
        if (this.exhibitForm.valid) {
            const formData = new FormData();

            this.languages.forEach((lang) => {
                formData.append(
                    `name_${lang.code}`,
                    this.exhibitForm.get(`name_${lang.code}`)?.value
                );
                formData.append(
                    `description_${lang.code}`,
                    this.exhibitForm.get(`description_${lang.code}`)?.value
                );

                const audioFile = this.audioFiles$.value[lang.code];
                if (audioFile) {
                    formData.append(`audio_${lang.code}`, audioFile);
                }
            });

            console.log('Submitting form data:', formData);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
