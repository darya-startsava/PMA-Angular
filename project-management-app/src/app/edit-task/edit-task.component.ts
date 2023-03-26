import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { UserLoginIdInterface } from '../sign-in-page/sign-in.service';

interface ColumnsIdTitle {
  columnId: string;
  title: string;
}

export interface EditTaskDataInterface {
  title?: string;
  description?: string;
  selectedColumnId?: string;
  columns?: Array<ColumnsIdTitle>;
  userId?: string;
  users?: Array<UserLoginIdInterface>;
  selectedUsers: Array<string>;
}

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent {
  title = new FormControl(this.data.title, Validators.required);
  description = new FormControl(this.data.description, Validators.required);
  column = new FormControl(this.data.selectedColumnId);
  users = new FormControl(
    this.data.users?.filter((item) =>
      this.data.selectedUsers.find((i) => i === item.userId)
    ),
    Validators.required
  );

  constructor(
    public createTaskRef: MatDialogRef<EditTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditTaskDataInterface
  ) {}

  onNoClick(): void {
    this.createTaskRef.close();
  }

  onEditClick(): void {
    this.createTaskRef.close({
      title: this.title.value,
      description: this.description.value,
      column: this.column.value,
      users: this.users.value,
    });
  }
}
