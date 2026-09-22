import { Routes } from '@angular/router';
import { OverviewComponent } from './page/overview/overview.component';
import { CourseComponent } from './page/course/course.component';
import { StudentsComponent } from './page/students/students.component';
import { TeachersComponent } from './page/teachers/teachers.component';
import { ReportsComponent } from './page/reports/reports.component';
import { SettingsComponent } from './page/settings/settings.component';
import { HelpComponent } from './page/help/help.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [],
  },
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', component: OverviewComponent, title: 'Tổng quan' },
  { path: 'courses', component: CourseComponent, title: 'Khóa học' },
  { path: 'students', component: StudentsComponent, title: 'Học viên' },
  { path: 'teachers', component: TeachersComponent, title: 'Giảng viên' },
  { path: 'reports', component: ReportsComponent, title: 'Báo cáo' },
  { path: 'settings', component: SettingsComponent, title: 'Cài đặt' },
  { path: 'help', component: HelpComponent, title: 'Trung tâm trợ giúp' },
  { path: '**', redirectTo: '' },
];
