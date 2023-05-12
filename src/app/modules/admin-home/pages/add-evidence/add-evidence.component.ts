import { concatMap } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CharacteristicID } from 'src/app/models/characteristic';
import { Evidence } from 'src/app/models/evidence';
import { SubindicatorID } from 'src/app/models/subindicators';
import { DialogAbstractComponent } from '../../component/dialog-abstract/dialog-abstract.component';
import { TypeID } from 'src/app/models/type';
import { combineLatest, from } from 'rxjs';
import { EvidenceService } from 'src/app/services/evidence/evidence.service';
import { SubindicatorService } from 'src/app/services/subindicator/subindicator.service';
import { TypeService } from 'src/app/services/type/type.service';
import { TitleService } from 'src/app/services/title/title.service';
import { ContinueEvidences } from '../../component/form-evidence/form-evidence.component';

@Component({
  selector: 'app-add-evidence',
  templateUrl: './add-evidence.component.html',
  styleUrls: ['./add-evidence.component.scss']
})
export class AddEvidenceComponent implements OnInit {

  characteristics!:CharacteristicID[]
  subIndicator!:SubindicatorID
  arrayEvidence: Evidence[] = []
  type!: TypeID
  step=0


  constructor(
    private evidenceService:EvidenceService,
    private titleService:TitleService
  ) { }

  ngOnInit(): void {
    this.titleService.addSubtitle('Agregar Evidencia')
  }

  changeStep(step:number){
    this.step=step
  }

  handleEvidence(event:ContinueEvidences){
    if(event.flag){
      this.changeStep(1)
      this.arrayEvidence=event.evidences!
    }
  }

  saveEvidence() {
    from(this.arrayEvidence).pipe(
      concatMap(evidence=>{
        return this.evidenceService.addEvidence(evidence)
        })
      ).subscribe(saveEvidence=>{
        console.log(saveEvidence)
      },error=>{
        console.log(error)
      })
  }

}
