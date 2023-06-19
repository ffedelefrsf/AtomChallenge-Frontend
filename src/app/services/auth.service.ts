import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  Auth,
  User,
  authState,
  idToken,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private auth: Auth = inject(Auth);
  private authState$ = authState(this.auth);
  private authStateSubscription: Subscription;
  private idToken$ = idToken(this.auth);
  private idTokenSubscription: Subscription;

  private _currentUser: User | null | undefined;
  private _token: string | null | undefined;

  constructor() {
    this.authStateSubscription = this.authState$.subscribe(
      (currentUser: User | null) => {
        this._currentUser = currentUser;
      }
    );
    this.idTokenSubscription = this.idToken$.subscribe(
      (token: string | null) => {
        this._token = token;
      }
    );
  }

  ngOnDestroy(): void {
    this.authStateSubscription.unsubscribe();
    this.idTokenSubscription.unsubscribe();
  }

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        return userCredential.user;
      })
      .catch((error) => {
        throw new Error(error.code);
      });
  }

  logout() {
    signOut(this.auth);
  }

  get authStateObservable() {
    return this.authState$;
  }

  get tokenObservable() {
    return this.idToken$;
  }

  get currentUser() {
    return this._currentUser;
  }

  get token() {
    return this._token;
  }
}
