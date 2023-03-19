import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { SignInService } from '../sign-in-page/sign-in.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  _subscription: any;
  token: string | undefined;

  constructor(
    private service: TranslocoService,
    public signInService: SignInService,
    private router: Router
  ) {
    this._subscription = signInService.tokenChange.subscribe(
      (value) => (this.token = value)
    );
  }

  change(lang: string) {
    this.service.setActiveLang(lang);
  }

  goToWelcomePage() {
    this.router.navigate(['welcome']);
  }

  onSignOut() {
    this.signInService.signOut();
    this.goToWelcomePage();
  }
}
