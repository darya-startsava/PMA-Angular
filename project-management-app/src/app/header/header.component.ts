import { Component } from '@angular/core';
import { TranslocoService } from "@ngneat/transloco";
import { Subscription } from 'rxjs';
import { SignInService } from '../sign-in-page/sign-in.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  _subscription: any;
  token: string | undefined;

  constructor(private service: TranslocoService,
    public signInService: SignInService,
  ) {
    this._subscription = signInService.tokenChange.subscribe((value) => this.token = value)
  }


  change(lang: string) {
    this.service.setActiveLang(lang);
  }
}
