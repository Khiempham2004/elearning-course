import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormItemComponent, NzFormModule } from 'ng-zorro-antd/form';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzImageModule } from 'ng-zorro-antd/image';
import {
  NzInputDirective,
  NzInputGroupWhitSuffixOrPrefixDirective,
  NzInputModule,
} from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { AuthService } from '../../../core/services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
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
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  loading = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private nzMessage: NzMessageService,
  ) {
    this.registerForm = this.fb.group({
      email: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [null],
    });
  }

  ngOnInit() {}

  login() {
    console.log('login success');
    this.router.navigate(['/login']);
  }
  register() {
    console.log('register success login');
    this.router.navigate(['/login']);
  }

  handleSubmit() {
    if (this.registerForm.invalid) {
      Object.values(this.registerForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.registerForm.markAllAsTouched();
        }
      });
      return;
    }

    const payload = this.registerForm.getRawValue();
    this.loading = true;
    this.authService.register(payload).subscribe({
      next: (res: any) => {
        this.login();
        this.loading = false;
        this.nzMessage.success('Đăng ký thành công');
      },
      error: (err: any) => {
        this.nzMessage.error('Đăng ký thất bại',err);
        this.loading = false;
      },
    });
  }
}
