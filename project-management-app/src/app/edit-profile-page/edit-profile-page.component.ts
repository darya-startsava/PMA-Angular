import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { SignInService } from '../sign-in-page/sign-in.service';
import { EditProfileService } from './edit-profile.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { Router } from '@angular/router';

import { DialogComponent } from '../dialog/dialog.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-edit-profile-page',
  templateUrl: './edit-profile-page.component.html',
  styleUrls: ['./edit-profile-page.component.scss'],
})
export class EditProfilePageComponent implements OnInit {
  message = '';
  token = '';
  login = '';
  name = '';
  messageToConfirm = this.translocoService.translate('confirmDeletion');

  editProfileForm = this.formBuilder.group({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    login: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
  });

  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    public signInService: SignInService,
    private editProfileService: EditProfileService,
    public dialog: MatDialog,
    private translocoService: TranslocoService,
    private router: Router,
    public confirmation: MatDialog
  ) {}

  goToWelcomePage(): void {
    this.router.navigate(['']);
  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      data: { message: this.message },
    });
  }

  updateForm() {
    this.editProfileForm.controls['name'].setValue(this.name);
    this.editProfileForm.controls['login'].setValue(this.login);
  }

  ngOnInit(): void {
    this.token = this.signInService.token;
    this.login = this.editProfileService.login || this.signInService.login;
    this.editProfileService
      .getUserByLogin(this.token, this.login)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.name = this.editProfileService.name;
          this.login = this.editProfileService.login;
          this.updateForm();
        },
        error: (error) => {
          switch (error.status) {
            case 403:
              this.signInService.signOut();
              this.goToWelcomePage();
              break;
            default:
              this.message =
                this.translocoService.translate('commonErrorMessage');
              this.openDialog();
          }
        },
      });
  }

  onSubmit(): void {
    this.editProfileService
      .updateUser(this.token, this.editProfileForm.value)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.message = this.translocoService.translate(
            'profileEditedMessage'
          );
          this.openDialog();
        },
        error: (error) => {
          switch (error.status) {
            case 403:
              this.signInService.signOut();
              this.goToWelcomePage();
              break;
            case 409:
              this.message = this.translocoService.translate(
                'existedLoginErrorMessage',
                { login: this.editProfileForm.value.login }
              );
              this.openDialog();
              break;
            default:
              this.message =
                this.translocoService.translate('commonErrorMessage');
              this.openDialog();
          }
        },
      });
  }

  openConfirmation(): void {
    const confirmationRef = this.confirmation.open(ConfirmationComponent, {
      data: {
        message: this.messageToConfirm,
      },
    });

    confirmationRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onDelete();
      }
    });
  }

  onDelete() {
    this.editProfileService
      .deleteProfile(this.token)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.signInService.signOut();
          this.goToWelcomePage();
        },
      });
  }
}
