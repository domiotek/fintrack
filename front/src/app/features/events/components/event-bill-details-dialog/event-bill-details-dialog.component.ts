import { Component, DestroyRef, inject, ViewContainerRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EventBillDetailsDialogData } from '../../models/event-bill-details-dialog-data';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../../../../core/models/dialog/confirmation-dialog-data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventBillDetailsDialogResponse } from '../../models/event-bill-details-dialog-response';
import { EventBillDialogData } from '../../models/add-event-bill-dialog-data';
import { AddEventBillDialogComponent } from '../add-event-bill-dialog/add-event-bill-dialog.component';

@Component({
  selector: 'app-event-bill-details-dialog',
  imports: [CommonModule, MatDialogModule, DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './event-bill-details-dialog.component.html',
  styleUrl: './event-bill-details-dialog.component.scss',
})
export class EventBillDetailsDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<EventBillDetailsDialogComponent>);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  protected readonly data = inject<EventBillDetailsDialogData>(MAT_DIALOG_DATA);

  protected editBill(): void {
    const dialogData: EventBillDialogData = {
      event: this.data.event,
      bill: this.data.eventBill,
      eventCurrency: this.data.eventCurrency,
      userCurrency: this.data.userCurrency,
    };

    const editDialogRef = this.dialog.open(AddEventBillDialogComponent, {
      width: '600px',
      data: dialogData,
      viewContainerRef: this.viewContainerRef,
    });

    editDialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: EventBillDetailsDialogResponse) => {
          if (result?.type === 'edit') {
            const response: EventBillDetailsDialogResponse = {
              type: 'edit',
              bill: result?.bill,
            };
            this.dialogRef.close(response);
          }
        },
        error: (error) => {
          console.error('Error closing dialog:', error);
        },
      });
  }

  protected deleteBill(): void {
    const dialogData: ConfirmationDialogData = {
      title: 'Usuń rachunek',
      message: 'Czy na pewno chcesz usunąć ten rachunek?',
    };

    const deleteDialogRef = this.dialog.open(ConfirmationDialogComponent, { data: dialogData });

    deleteDialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result) {
            const response: EventBillDetailsDialogResponse = {
              type: 'delete',
              bill: null,
            };
            this.dialogRef.close(response);
          }
        },
        error: (error) => {
          console.error('Error closing dialog:', error);
        },
      });
  }
}
