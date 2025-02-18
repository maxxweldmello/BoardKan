import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Users } from '../users-interface';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../auth.css']
})
export class SigninComponent {
  signinForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signinForm = this.fb.group({
      username: ['', [Validators.required, this.usernameValidator()]],
      password: ['', Validators.required]
    });
  }

  usernameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const username = control.value;
      const regex = /^[a-zA-Z]+$/; 
      
      return regex.test(username) ? null : { invalidUsername: 'Username must contain only alphabets.' };
    };
  }
  

  onSubmit() {
    if (this.signinForm.valid) {
      this.authService.signin(this.signinForm.value).subscribe({
        next: (response: Users) => {
          this.authService.setToken(response.token);
          this.router.navigate(['/kanban-board']);
        },
        error: (err) => console.error('Signin error:', err)
      });
    }
  }
}
