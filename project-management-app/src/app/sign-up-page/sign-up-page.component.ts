import { Component } from '@angular/core';
import { take } from 'rxjs';
import { SignUpService } from './sign-up.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { Router } from '@angular/router';

import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss'],
})
export class SignUpPageComponent {
  signUpForm = this.formBuilder.group({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
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
    public signUpService: SignUpService,
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

  goToSignInPage(): void {
    this.router.navigate(['sign-in']);
  }

  onSubmit(): void {
    this.requestPending = true;
    const login = this.signUpForm.value.login;
    this.signUpService
      .signUp(this.signUpForm.value)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.requestPending = false;
          this.message = this.translocoService.translate(
            'successfullyRegisteredMessage',
            { login: login }
          );
          this.openDialog();
          this.goToSignInPage();
        },
        error: (error) => {
          this.requestPending = false;
          switch (error.status) {
            case 409:
              this.message = this.translocoService.translate(
                'existedLoginErrorMessage',
                { login: login }
              );
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
