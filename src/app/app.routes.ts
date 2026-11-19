import { Routes } from '@angular/router';
import { ReportsComponent } from './modules/page/reports/reports.component';
import { SettingsComponent } from './modules/page/settings/settings.component';
import { HelpComponent } from './modules/page/help/help.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { DirectoryComponent } from './layouts/directory/directory.component';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { TeachersComponent } from './modules/page/teachers/teachers.component';
import { CourseComponent } from './modules/page/course/course.component';
import { StudentsComponent } from './modules/page/students/students.component';
import { OverviewComponent } from './modules/page/overview/overview.component';
import { StudentLayoutsComponent } from './layouts/student-layouts/student-layouts.component';
import { StudentElearningComponent } from './modules/student-elearning/student-elearning.component';
import { TeacherLayoutComponent } from './layouts/teacher-layout/teacher-layout.component';
import { CourseLayoutComponent } from './layouts/course-layout/course-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['admin'] },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'courses',
        component: CourseComponent,
      },
      {
        path: 'learning-activities',
        loadComponent: () =>
          import('./modules/page/learning-activities/learning-activities.component').then(
            (m) => m.LearningActivitiesComponent,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./modules/admin-users/admin-users.component').then(
            (m) => m.AdminUsersComponent,
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./modules/admin-categories/admin-categories.component').then(
            (m) => m.AdminCategoriesComponent,
          ),
      },
      {
        path: 'enrollments',
        loadComponent: () =>
          import('./modules/admin-enrollments/admin-enrollments.component').then(
            (m) => m.AdminEnrollmentsComponent,
          ),
      },
      {
        path: 'student',
        component: StudentsComponent,
      },
      {
        path: 'teachers',
        component: TeachersComponent,
      },
      { path: 'reports', component: ReportsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'signOut', component: HelpComponent },
    ],
  },
  {
    path: 'directory',
    component: DirectoryComponent,
    canActivate: [authGuard],
    data: { roles: ['admin', 'directory'], breadcrumb: 'Quản lý danh mục' },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'portfolio-management',
      },
      {
        path: 'portfolio-management',
        data: { breadcrumb: 'Quản lý danh mục các cấp' },
        loadChildren: () =>
          import('./component/component.module').then((m) => m.ComponentModule),
      },
      {
        path: 'multi-level-management',
        data: { breadcrumb: 'Quản lý danh mục các phòng' },
        loadChildren: () =>
          import('./modules/directoryRoom/directoryRoom.module').then(
            (m) => m.DirectoryRoomModule,
          ),
      },
      {
        path: 'user-management',
        data: { breadcrumb: 'Quản lý người dùng' },
        loadChildren: () =>
          import('./modules/user-management/user-management.module').then(
            (m) => m.UserManagementModule,
          ),
      },
      {
        path: 'role-management',
        data: { breadcrumb: 'Quản lý vai trò / phân quyền' },
        loadChildren: () =>
          import('./modules/role-management/role-management.module').then(
            (m) => m.RoleManagementModule,
          ),
      },
      {
        path: 'system-management',
        data: { breadcrumb: 'Quản lý chức năng hệ thống' },
        loadChildren: () =>
          import('./modules/system-management/system-management.module').then(
            (m) => m.SystemManagementModule,
          ),
      },
      {
        path: 'user-group-management',
        data: { breadcrumb: 'Quản lý nhóm người dùng' },
        loadChildren: () =>
          import('./modules/user-group-management/user-group-management.module').then(
            (m) => m.UserGroupManagementModule,
          ),
      },
      {
        path: 'configuration-management',
        data: { breadcrumb: 'Quản lý cấu hình hệ thống' },
        loadChildren: () =>
          import('./modules/configuration-management/configuration-management.module').then(
            (m) => m.ConfigurationManagementModule,
          ),
      },
      {
        path: 'system-log-management',
        data: { breadcrumb: 'Quản lý nhật ký hệ thống' },
        loadChildren: () =>
          import('./modules/system-log-management/system-log-management.module').then(
            (m) => m.SystemLogManagementModule,
          ),
      },
      {
        path: 'notification-management',
        data: {
          breadcrumb: 'Quản lý thông báo',
        },
        loadChildren: () =>
          import('./modules/notification-management/notification-management.module').then(
            (m) => m.NotificationManagementModule,
          ),
      },
    ],
  },
  {
    path: 'student',
    component: StudentLayoutsComponent,
    canActivate: [authGuard],
    data: { roles: ['student'], breadcrumb: 'Không gian học tập' },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        data: { breadcrumb: 'Tổng quan' },
        loadComponent: () =>
          import('./modules/student-elearning/student-overview/student-overview.component').then(
            (m) => m.StudentOverviewComponent,
          ),
      },
      {
        path: 'courses',
        data: { breadcrumb: 'Quản lý khóa học' },
        loadComponent: () =>
          import('./modules/student-elearning/course-student/course-student.component').then(
            (m) => m.CourseStudentComponent,
          ),
      },
      {
        path: 'schedule',
        data: { breadcrumb: 'Quản lý lịch học' },
        loadComponent: () =>
          import('./modules/student-elearning/schedule-student/schedule-student.component').then(
            (m) => m.ScheduleStudentComponent,
          ),
      },
      {
        path: 'assignments',
        data: { breadcrumb: 'Quản lý bài tập' },
        loadComponent: () =>
          import('./modules/student-elearning/assignments-elearning/assignments-elearning.component').then(
            (m) => m.AssignmentsElearningComponent,
          ),
      },
      {
        path: 'exams',
        data: { breadcrumb: 'Quản lý bài kiểm tra' },
        loadComponent: () =>
          import('./modules/student-elearning/exams-elearning/exams-elearning.component').then(
            (m) => m.ExamsElearningComponent,
          ),
      },
      {
        path: 'information',
        data: { breadcrumb: 'Thông tin cá nhân' },
        loadComponent: () =>
          import('./modules/student-elearning/student-information/student-information.component').then(
            (m) => m.StudentInformationComponent,
          ),
      },
      {
        path: 'progress',
        data: { breadcrumb: 'Quản lý tiến độ học tập' },
        loadComponent: () =>
          import('./modules/student-elearning/course-progress/course-progress.component').then(
            (m) => m.CourseProgressComponent,
          ),
      },
    ],
  },
  {
    path: 'teacher',
    component: TeacherLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['teacher'] },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./modules/page/teacher-dashboard/teacher-dashboard.component').then(
            (m) => m.TeacherDashboardComponent,
          ),
      },
      {
        path: 'learning-activities',
        loadComponent: () =>
          import('./modules/page/learning-activities/learning-activities.component').then(
            (m) => m.LearningActivitiesComponent,
          ),
      },
      { path: 'courses', component: CourseComponent },
    ],
  },
  {
    path: 'courses',
    component: CourseLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['course'] },
    children: [{ path: '', component: CourseComponent }],
  },
  {
    path: '',
    component: RegisterComponent,
    pathMatch: 'full',
  },
];
