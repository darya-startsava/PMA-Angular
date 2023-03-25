import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { UserLoginIdInterface } from '../sign-in-page/sign-in.service';

interface ColumnsIdTitle {
  columnId: string;
  title: string;
}

export interface CreateTaskDataInterface {
  columnId?: string;
  columns?: [ColumnsIdTitle];
  userId?: string;
  users?: Array<UserLoginIdInterface>;
}

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent {
  title = new FormControl('', Validators.required);
  description = new FormControl('', Validators.required);
  column = new FormControl(
    this.data?.columns ? this.data.columns[0].columnId : ''
  );
  users = new FormControl('', Validators.required);

  constructor(
    public createTaskRef: MatDialogRef<CreateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateTaskDataInterface
  ) {}

  onNoClick(): void {
    this.createTaskRef.close();
  }

  onCreateClick(): void {
    this.createTaskRef.close({
      title: this.title.value,
      description: this.description.value,
      column: this.column.value,
      users: this.users.value,
    });
  }
}
