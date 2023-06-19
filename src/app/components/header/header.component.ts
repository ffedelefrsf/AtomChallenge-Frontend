import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { Route } from 'src/app/utils/routes.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  host: {
    class: 'header-container',
  },
})
export class HeaderComponent {
  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);

  logout() {
    this.authService.logout();
    this.router.navigate([Route.LOGIN], { replaceUrl: true });
  }
}
