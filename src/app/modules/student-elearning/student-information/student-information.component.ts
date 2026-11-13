import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-information',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './student-information.component.html',
  styleUrl: './student-information.component.css',
})
export class StudentInformationComponent implements OnInit {
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly form: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
  ) {
    this.form = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (response) => {
        const user = response?.user ?? response?.data?.user;
        if (!user) {
          this.errorMessage.set('Không nhận được thông tin hồ sơ từ máy chủ.');
          this.loading.set(false);
          return;
        }
        this.form.patchValue({ userName: user.userName ?? '', email: user.email ?? '' });
        localStorage.setItem('user', JSON.stringify(user));
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error?.error?.message ?? 'Không tải được thông tin cá nhân.');
        this.loading.set(false);
      },
    });
  }

  save(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const currentPassword = this.form.controls['currentPassword'].value as string;
    const newPassword = this.form.controls['newPassword'].value as string;
    if (newPassword && !currentPassword) {
      this.form.controls['currentPassword'].markAsTouched();
      this.errorMessage.set('Nhập mật khẩu hiện tại để xác nhận đổi mật khẩu.');
      return;
    }

    this.saving.set(true);
    const payload = {
      userName: this.form.controls['userName'].value!.trim(),
      email: this.form.controls['email'].value!.trim(),
      ...(newPassword ? { currentPassword, newPassword } : {}),
    };
    this.authService.updateProfile(payload).subscribe({
      next: (response) => {
        const updatedUser = response?.user ?? response?.data?.user;
        if (updatedUser) localStorage.setItem('user', JSON.stringify(updatedUser));
        this.form.patchValue({ currentPassword: '', newPassword: '' });
        this.successMessage.set(response?.message ?? 'Đã cập nhật thông tin cá nhân.');
        this.saving.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error?.error?.message ?? 'Cập nhật thông tin thất bại.');
        this.saving.set(false);
      },
    });
  }
}
