import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
//import { SettingsComponent } from './settings/settings.component';
import { SettingPageComponent } from './setting-page/setting-page.component';


const routes: Routes = [
  { path: 'setting', component: SettingPageComponent },
  { path: 'manage', component: ManageComponent },
  //{ path: 'SettingsModal', component: SettingsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
