import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmationData {
  message: string;
}

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationData,
    public confirmationRef: MatDialogRef<ConfirmationComponent>
  ) {}

  onConfirm(): void {
    // Close the dialog, return true
    this.confirmationRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.confirmationRef.close(false);
  }
}
