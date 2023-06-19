import { Injectable, inject } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { User } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Route } from '../utils/routes.enum';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);

  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.authStateObservable.pipe(
      map((currentUser: User | null) => {
        if (currentUser) {
          return true;
        } else {
          this.snackBar.open('Forbidden Resource.', 'Close', {
            duration: 3000,
          });
          this.router.navigate([Route.LOGIN], { replaceUrl: true });
          return false;
        }
      })
    );
  }
}
