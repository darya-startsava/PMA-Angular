import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

export interface CreateTaskDataInterface {
  title: 'string';
  columnId: 'string';
}

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent {
  title = new FormControl(this.data.title, Validators.required);
  columnId = '6419da83a29eef133574a54f';

  constructor(
    public createTaskRef: MatDialogRef<CreateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateTaskDataInterface
  ) {}

  onNoClick(): void {
    this.createTaskRef.close();
  }

  onCreateClick(data: CreateTaskDataInterface): void {
    this.createTaskRef.close(data);
  }
}
