import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminHomeRoutingModule } from './admin-home-routing.module';
import { LayoutComponent } from './pages/layout/layout.component';
import { LastUpdateComponent } from './component/last-update/last-update.component';
import { QuadrantComponent } from './pages/quadrant/quadrant.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './pages/home/home.component';
import { IndicatorComponent } from './pages/indicator/indicator.component';
import { IndicatorGeneralComponent } from './component/indicator-general/indicator-general.component';
import { NavbarIndicatorsComponent } from './component/navbar-indicators/navbar-indicators.component';
import { MaterialModule } from 'src/app/material/material.module';
import { SpecificSubindicatorsComponent } from './pages/specific-subindicators/specific-subindicators.component';
import { AddSubindicatorComponent } from './pages/add-subindicator/add-subindicator.component';
import { DialogAbstractComponent } from './component/dialog-abstract/dialog-abstract.component';
import { CardInfoComponent } from './component/card-info/card-info.component';
import { HistoryComponent } from './component/history/history.component';
import { InfoComponent } from './component/info/info.component';
import { AddEvidenceComponent } from './pages/add-evidence/add-evidence.component';
import { SubindicatorGeneralComponent } from './component/subindicator-general/subindicator-general.component';
import { StepsEvidenceComponent } from './component/steps-evidence/steps-evidence.component';
import { FormEvidenceComponent } from './component/form-evidence/form-evidence.component';
import { FinishEvidenceComponent } from './component/finish-evidence/finish-evidence.component';
import { AddSubindicatorDataComponent } from './component/add-subindicator-data/add-subindicator-data.component';
import { AddSubindicatorEvidencesComponent } from './component/add-subindicator-evidences/add-subindicator-evidences.component';
import { AddSubindicatorConfirmComponent } from './component/add-subindicator-confirm/add-subindicator-confirm.component';
import { StepsSubindicatorComponent } from './component/steps-subindicator/steps-subindicator.component';
import { ReviewSubindicatorSpecifidcComponent } from './pages/review-subindicator-specifidc/review-subindicator-specifidc.component';
import { LayoutIndicatorComponent } from './pages/layout-indicator/layout-indicator.component';
import { DialogCheckEvidenceComponent } from './component/dialog-check-evidence/dialog-check-evidence.component';
import { UsersComponent } from './pages/users/users.component';
import { DialogNewUserComponent } from './component/dialog-new-user/dialog-new-user.component';
import { UserConfigComponent } from './pages/user-config/user-config.component';
import { WorkspaceComponent } from './pages/workspace/workspace.component';
import { SummaryIndicatorComponent } from './pages/summary-indicator/summary-indicator.component';
import { SpecificSubindicatorsTableComponent } from './component/specific-subindicators/specific-subindicators.component';
import { HelpComponent } from './pages/help/help.component';
import { WkconfigComponent } from './pages/wkconfig/wkconfig.component';
import { NotificationsListComponent } from './pages/notifications-list/notifications-list.component';


@NgModule({
  declarations: [
    LayoutComponent,
    LastUpdateComponent,
    QuadrantComponent,
    HomeComponent,
    IndicatorComponent,
    IndicatorGeneralComponent,
    NavbarIndicatorsComponent,
    SpecificSubindicatorsComponent,
    AddSubindicatorComponent,
    DialogAbstractComponent,
    CardInfoComponent,
    HistoryComponent,
    InfoComponent,
    AddEvidenceComponent,
    SubindicatorGeneralComponent,
    StepsEvidenceComponent,
    FormEvidenceComponent,
    FinishEvidenceComponent,
    AddSubindicatorDataComponent,
    AddSubindicatorEvidencesComponent,
    AddSubindicatorConfirmComponent,
    StepsSubindicatorComponent,
    ReviewSubindicatorSpecifidcComponent,
    LayoutIndicatorComponent,
    DialogCheckEvidenceComponent,
    UsersComponent,
    DialogNewUserComponent,
    UserConfigComponent,
    WorkspaceComponent,
    SummaryIndicatorComponent,
    SpecificSubindicatorsTableComponent,
    HelpComponent,
    WkconfigComponent,
    NotificationsListComponent
  ],
  imports: [
    CommonModule,
    AdminHomeRoutingModule,
    SharedModule,
    MaterialModule
  ]
})
export class AdminHomeModule { }
