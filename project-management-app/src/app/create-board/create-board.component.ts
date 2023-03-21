import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

export interface CreateBoardData {
  title: 'string';
}

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss'],
})
export class CreateBoardComponent {
  title = new FormControl(this.data.title, Validators.required);

  constructor(
    public createBoardRef: MatDialogRef<CreateBoardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateBoardData
  ) {}

  onNoClick(): void {
    this.createBoardRef.close();
  }

  onCreateClick(title:string): void {
    this.createBoardRef.close(title);
  }
}
