import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ComponentComponent } from './component.component';
import { RouterModule, Routes } from '@angular/router';
import { CpnConComponent } from './cpnCon/cpnCon.component';
import { AreaConComponent } from './area-con/area-con.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectComponent, NzOptionComponent } from 'ng-zorro-antd/select';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { NzIconModule } from 'ng-zorro-antd/icon';
const routes: Routes = [{ path: '', component: ComponentComponent }];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NzTabsModule,
    NzInputDirective,
    NzButtonComponent,
    NzTableComponent,
    NzModalModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzColDirective,
    NzOptionComponent,
    NzSpinModule,
    NzPaginationComponent,
    NzSelectComponent,
    NzButtonModule,
    NzIconModule,
    NzRowDirective,
],
  declarations: [ComponentComponent, CpnConComponent, AreaConComponent],
  exports: [],
  providers: [],
})
export class ComponentModule {}
