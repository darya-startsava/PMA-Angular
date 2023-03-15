import { Component } from '@angular/core';
import { SignUpService } from './sign-up.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';


import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  providers: [SignUpService],
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent {
  hide = true;


  signUpForm = this.formBuilder.group({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    login: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  message = '';

  constructor(public signUpService: SignUpService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private translocoService: TranslocoService) { }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      data: { message: this.message },
    });
  }

  clearForm(): void {
    this.signUpForm.reset()
  }


  onSubmit(): void {
    const login = this.signUpForm.value.login;
    this.signUpService.signUp(this.signUpForm.value).subscribe({
      next: () => {
        this.message = this.translocoService.translate('successfullyRegisteredMessage', { login: login });
        this.openDialog();
        this.clearForm();
      }, error: (error) => {
        switch (error.status) {
          case 409:
            this.message = this.translocoService.translate('existedLoginErrorMessage', { login: login });
            break;
          default:
            this.message = this.translocoService.translate('commonErrorMessage');
        }
        this.openDialog();
      }
    })
  }

}
