import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/services/admin-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-auth.component.html',
  styleUrl: './admin-auth.component.css',
})
export class AdminAuthComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {}

  onLogin(): void {
    this.submitted = true;
    
    if (this.loginForm.invalid) {
      alert('Helytelen adatok!');
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.adminLogin({ email, password });
  }
}
