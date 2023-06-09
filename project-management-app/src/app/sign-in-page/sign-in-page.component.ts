import { Component } from '@angular/core';
import { take } from 'rxjs';
import { SignInService } from './sign-in.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { Router } from '@angular/router';

import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss'],
})
export class SignInPageComponent {
  signInForm = this.formBuilder.group({
    login: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
  });

  message = '';
  hide = true;
  requestPending = false;

  constructor(
    public signInService: SignInService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private translocoService: TranslocoService,
    private router: Router
  ) {}

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      data: { message: this.message },
    });
  }

  goToMainPage(): void {
    this.router.navigate(['main']);
  }

  onSubmit(): void {
    this.requestPending = true;
    this.signInService
      .signIn(this.signInForm.value)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.requestPending = false;
          this.goToMainPage();
          this.signInService.getUserByLogin().subscribe();
        },
        error: (error) => {
          this.requestPending = false;
          switch (error.status) {
            case 401:
              this.message =
                this.translocoService.translate('wrongAuthMessage');
              break;
            default:
              this.message =
                this.translocoService.translate('commonErrorMessage');
          }
          this.openDialog();
        },
      });
  }
}
