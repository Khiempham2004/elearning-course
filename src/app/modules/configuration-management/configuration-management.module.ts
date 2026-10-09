import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationManagementComponent } from './configuration-management.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationManagementComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [ConfigurationManagementComponent],
})
export class ConfigurationManagementModule {}
