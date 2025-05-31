import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  readonly title = input('Czy na pewno chcesz kontynuować?');
  readonly message = input('Ta operacja jest nieodwracalna. Kontynuować?');
  readonly cancelButtonText = input('Anuluj');
  readonly confirmButtonText = input('Potwierdź');

  private readonly dialogRef = inject(DialogRef<boolean>);

  onAnswer(answer: boolean): void {
    this.dialogRef.close(answer);
  }
}
