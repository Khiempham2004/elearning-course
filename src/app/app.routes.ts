import { Routes } from '@angular/router';
import { OverviewComponent } from './modules/page/overview/overview.component';
import { CourseComponent } from './modules/page/course/course.component';
import { StudentsComponent } from './modules/page/students/students.component';
import { TeachersComponent } from './modules/page/teachers/teachers.component';
import { ReportsComponent } from './modules/page/reports/reports.component';
import { SettingsComponent } from './modules/page/settings/settings.component';
import { HelpComponent } from './modules/page/help/help.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent, title: 'Tổng quan' },
      { path: 'courses', component: CourseComponent, title: 'Khóa học' },
      { path: 'students', component: StudentsComponent, title: 'Học viên' },
      { path: 'teachers', component: TeachersComponent, title: 'Giảng viên' },
      { path: 'reports', component: ReportsComponent, title: 'Báo cáo' },
      { path: 'settings', component: SettingsComponent, title: 'Cài đặt' },
      { path: 'signOut', component: HelpComponent, title: 'Đăng xuất' },
    ],
  },
  {
    path: '',
    component: RegisterComponent,
    pathMatch: 'full',
  },
];
