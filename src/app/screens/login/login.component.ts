import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { Route } from 'src/app/utils/routes.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: { class: 'router-container' },
})
export class LoginComponent {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);

  form: FormGroup = this.formBuilder.group({
    email: this.formBuilder.control('', [
      Validators.required,
      Validators.maxLength(100),
      Validators.email,
    ]),
    password: this.formBuilder.control('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
  });

  errorMessage: string;
  loading: boolean;

  get controls() {
    return this.form.controls;
  }

  private initLoginProcess() {
    this.errorMessage = '';
    this.loading = true;
  }

  onLoginFormFieldInput() {
    this.errorMessage = '';
  }

  onSubmit() {
    const {
      email: { value: email },
      password: { value: password },
    } = this.controls;
    this.initLoginProcess();
    this.authService
      .signIn(email, password)
      .then((_user) => {
        this.router.navigate([Route.HOME], { replaceUrl: true });
      })
      .catch((error) => {
        this.controls['password'].setValue('');
        this.errorMessage = 'An error occurred';
        const errorCode = error.message;
        if (errorCode === 'auth/user-not-found') {
          this.errorMessage = 'Invalid Username or Password';
        }
        this.loading = false;
      });
  }
}
