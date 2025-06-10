import { Component, DestroyRef, inject, model, OnInit, signal } from '@angular/core';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ChangePasswordFormComponent } from '../../components/change-password-form/change-password-form.component';
import { PersonalInfoFormComponent } from '../../components/personal-info-form/personal-info-form.component';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Currency } from '../../../../core/models/currency/currency.model';

@Component({
  selector: 'app-settings',
  imports: [
    AvatarComponent,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ChangePasswordFormComponent,
    PersonalInfoFormComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  readonly email = signal<string>('');
  readonly currency = signal<Currency | null>(null);
  readonly firstName = model<string>();
  readonly lastName = model<string>();

  private readonly appStateStore = inject(AppStateStore);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.appStateStore.appState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => {
      this.firstName.set(state.firstName ?? '');
      this.lastName.set(state.lastName ?? '');
      this.email.set(state.email!);
      this.currency.set(state.currency ?? null);
    });
  }
}
