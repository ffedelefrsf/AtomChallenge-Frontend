import { Component, OnDestroy, inject } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Route } from './utils/routes.enum';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);
  private unsubscribe = new Subject<void>();

  loading = false;

  constructor() {
    this.router.events
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((routerEvent) => {
        if (routerEvent instanceof NavigationStart) {
          this.loading = true;
        }

        if (
          routerEvent instanceof NavigationEnd ||
          routerEvent instanceof NavigationCancel
        ) {
          this.loading = false;
        } else if (routerEvent instanceof NavigationError) {
          this.loading = false;
          this.authService.logout();
          this.router.navigate([Route.LOGIN], { replaceUrl: true });
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.unsubscribe();
  }
}
