import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedGlobalModule } from '../shared-global/shared-global.module';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbAccordionModule, NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import { AjoutTransporteurComponent } from './transporteur/ajout-transporteur/ajout-transporteur.component';
import { ListTransporteurComponent } from './transporteur/list-transporteur/list-transporteur.component';
import { ModifierTransporteurComponent } from './transporteur/modifier-transporteur/modifier-transporteur.component';
import { PopupTransporteurComponent } from './popups/popup-transporteur/popup-transporteur.component';
import { ModifierlistparamComponent } from './livraison/modifierlistparam/modifierlistparam.component';
import { ListparamlivraisonComponent } from './livraison/listparamlivraison/listparamlivraison.component';
import { ValiderParamComponent } from './parametrelivraison/valider-param/valider-param.component';
import { ModifierParamComponent } from './parametrelivraison/modifier-param/modifier-param.component';
import { MiseAJourComponent } from './parametrelivraison/mise-a-jour/mise-a-jour.component';
import { HeaderANDfooterPDFComponent } from './parametrelivraison/header-andfooter-pdf/header-andfooter-pdf.component';
@NgModule({
  declarations: [
    AjoutTransporteurComponent,
    ListTransporteurComponent,
    ModifierTransporteurComponent,
    PopupTransporteurComponent,
    ListparamlivraisonComponent,
    HeaderANDfooterPDFComponent,
    ModifierlistparamComponent,
    ValiderParamComponent,
    ModifierParamComponent,
    MiseAJourComponent
   
   
  ],
  imports: [
    CommonModule,
    SharedGlobalModule,
    SharedModule,
    NgbTabsetModule,
    NgbAccordionModule, NgbCollapseModule
  ],
  exports:[

  ]
})
export class ComerceModule { }
