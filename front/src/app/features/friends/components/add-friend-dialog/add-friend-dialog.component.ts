import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AlertPanelComponent } from '../../../../shared/components/alert-panel/alert-panel.component';
import { ApiErrorCode } from '../../../../core/models/error-codes.enum';
import { FriendService } from '../../../../core/services/friend/friend.service';
import { FormProgressBarComponent } from '../../../../shared/components/form-progress-bar/form-progress-bar.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-friend-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    AlertPanelComponent,
    FormProgressBarComponent,
  ],
  templateUrl: './add-friend-dialog.component.html',
  styleUrl: './add-friend-dialog.component.scss',
})
export class AddFriendDialogComponent {
  form = new FormGroup({
    email: new FormControl<string>('', { validators: [Validators.required, Validators.email] }),
  });

  errorCode = signal<ApiErrorCode | null>(null);
  submitting = signal<boolean>(false);

  readonly friendService = inject(FriendService);
  readonly dialogRef = inject(MatDialogRef<AddFriendDialogComponent>);
  readonly destroyRef = inject(DestroyRef);
  readonly snackBar = inject(MatSnackBar);

  onSubmit() {
    if (!this.form.valid) return;

    this.submitting.set(true);

    this.friendService.sendFriendRequest(this.form.value.email!).subscribe({
      complete: () => {
        this.dialogRef.close();
        this.submitting.set(false);
        this.snackBar.open('Zaproszenie wysłane pomyślnie!', 'Zamknij');
      },
      error: (err) => {
        this.errorCode.set(err.error?.code);
        this.submitting.set(false);
      },
    });
  }
}
