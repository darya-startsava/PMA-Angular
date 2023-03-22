import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

export interface CreateColumnData {
  title: 'string';
}

@Component({
  selector: 'app-create-column',
  templateUrl: './create-column.component.html',
  styleUrls: ['./create-column.component.scss'],
})
export class CreateColumnComponent {
  title = new FormControl(this.data.title, Validators.required);

  constructor(
    public createColumnRef: MatDialogRef<CreateColumnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateColumnData
  ) {}

  onNoClick(): void {
    this.createColumnRef.close();
  }

  onCreateClick(title: string): void {
    this.createColumnRef.close(title);
  }
}
