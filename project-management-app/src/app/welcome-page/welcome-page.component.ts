import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { SignInService } from '../sign-in-page/sign-in.service';
import { WelcomePageService } from './welcome-page.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {
  constructor(
    public signInService: SignInService,
    private router: Router,
    private welcomePageService: WelcomePageService
  ) {}

  ngOnInit(): void {
    if (this.signInService.token) {
      this.goToMainInPage();
    }
    this.welcomePageService.wakeUpServer().pipe(take(1)).subscribe();
  }

  goToMainInPage(): void {
    this.router.navigate(['main']);
  }
}
