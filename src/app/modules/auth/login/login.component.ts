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
import { AuthService } from '../../../core/services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

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
  loading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private nzMessage: NzMessageService,
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
    const payload = {
      userName: this.loginForm.value.userName,
      password: this.loginForm.value.password,
    };

    this.loading = true;
    this.authService.login(payload).subscribe({
      next: (res: any) => {
        this.authService.saveLoginData(res);
        const role = res.user?.role;
        switch (role) {
          case 'admin':
            this.router.navigate(['/admin']);
            break;

          case 'teacher':
            this.router.navigate(['/teacher']);
            break;

          case 'student':
            this.router.navigate(['/student']);
            break;

          case 'course':
            this.router.navigate(['/courses']);
            break;

          case 'directory':
            this.router.navigate(['/directory']);
            break;

          default:
            this.authService.logout();
            alert('Tài khoản chưa được phân quyền!');
            break;
        }
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        this.loading = false;
        this.nzMessage.success('Đăng nhập thành công');
      },
      error: (err: any) => {
        this.nzMessage.error(err.error?.message || 'Đăng nhập thất bại');
        this.loading = false;
      },
    });
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
