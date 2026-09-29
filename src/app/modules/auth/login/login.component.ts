import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormItemComponent, NzFormModule } from 'ng-zorro-antd/form';
import { NzColDirective } from 'ng-zorro-antd/grid';
import {
  NzInputDirective,
  NzInputSuffixDirective,
  NzInputPrefixDirective,
  NzInputGroupWhitSuffixOrPrefixDirective,
  NzInputModule,
} from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabLinkTemplateDirective } from 'ng-zorro-antd/tabs';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    NzImageModule,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzColDirective,
    NzInputDirective,
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzInputGroupWhitSuffixOrPrefixDirective,
    NzCheckboxModule,
    NzImageModule,
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [null],
    });
  }

  ngOnInit() {}

  login() {
    console.log('login success');
    this.router.navigate(['/admin']);
  }
  register() {
    console.log('register success login');
    this.router.navigate(['/register']);
  }

  handleSubmit() {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.loginForm.markAllAsTouched();
        }
      });
      return;
    }
    this.login();
  }
}
