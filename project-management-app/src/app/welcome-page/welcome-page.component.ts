import { Component, OnInit } from '@angular/core';
import { SignInService } from '../sign-in-page/sign-in.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {


  constructor(public signInService: SignInService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.signInService.token) {
      this.goToMainInPage()
    }
  }

  goToMainInPage(): void {
    this.router.navigate(['main']);
  }

}
