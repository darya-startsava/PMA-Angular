import { Component } from '@angular/core';
import { SignUpInterface, SignUpService } from './sign-up.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  providers: [SignUpService],
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent {
  hide = true;
  user: SignUpInterface | undefined;

  signUpForm = this.formBuilder.group({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    login: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  constructor(private signUpService: SignUpService,
    private formBuilder: FormBuilder,) { }

  onSubmit(): void {
    this.signUpService.signUp(this.signUpForm.value)
      .subscribe(user => {
        this.user = user;
      });
  }

}
