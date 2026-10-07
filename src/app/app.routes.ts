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
import { AreaConComponent } from './component/area-con/area-con.component';
import { CpnConComponent } from './component/cpnCon/cpnCon.component';
import { ComponentComponent } from './component/component.component';
import { DirectoryComponent } from './layouts/directory/directory.component';

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
      { path: 'overview', component: OverviewComponent },
      { path: 'courses', component: CourseComponent },
      { path: 'students', component: StudentsComponent },
      { path: 'teachers', component: TeachersComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'signOut', component: HelpComponent },
    ],
  },
  {
    path: 'directory',
    component: DirectoryComponent,
    data: { breadcrumb: 'Quản lý danh mục' },
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
          import('./directoryRoom/directoryRoom.module').then(
            (m) => m.DirectoryRoomModule,
          ),
      },
    ],
  },
  {
    path: '',
    component: RegisterComponent,
    pathMatch: 'full',
  },
];
