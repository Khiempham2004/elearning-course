import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentComponent } from './component.component';
import { RouterModule, Routes } from '@angular/router';
import { CpnConComponent } from './cpnCon/cpnCon.component';
import { AreaConComponent } from './area-con/area-con.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

const routes: Routes = [{ path: '', component: ComponentComponent }];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    AreaConComponent,
    CpnConComponent,
    NzTabsModule
  ],
  declarations: [ComponentComponent],
  exports: [],
  providers: [],
})
export class ComponentModule {}
