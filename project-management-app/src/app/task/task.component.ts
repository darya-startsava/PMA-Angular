import { Component, Input, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Router } from '@angular/router';

import {
  SignInService,
  UserLoginIdInterface,
} from '../sign-in-page/sign-in.service';
import { GetAllTasksByColumnIdInterface } from '../column/column.service';
import { DialogComponent } from '../dialog/dialog.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  @Input() task!: GetAllTasksByColumnIdInterface;
  token = '';
  message = '';
  messageToConfirmTaskDeletion = this.translocoService.translate(
    'confirmDeletionTask'
  );
  users: Array<UserLoginIdInterface> = [];
  userLoginsInString = '';

  constructor(
    private translocoService: TranslocoService,
    public signInService: SignInService,
    public confirmation: MatDialog,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.signInService.token;
    this.users = this.signInService.users;
    this.userLoginsInString = this.users
      .filter((item) => this.task.users.find((i) => i === item.userId))
      .map((i) => i.login)
      .join(', ');
  }

  goToWelcomePage(): void {
    this.router.navigate(['']);
  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      data: { message: this.message },
    });
  }

  onOpenConfirmationDeleteTask(): void {}
}
