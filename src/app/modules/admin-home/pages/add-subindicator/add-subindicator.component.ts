import { mergeMap, concatMap, catchError } from 'rxjs/operators';
import { Location, ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { CharacteristicID } from 'src/app/models/characteristic';
import { Evidence, EvidenceID } from 'src/app/models/evidence';
import { IndicatorInstanceID } from 'src/app/models/indicatorInstance';
import { Subindicator } from 'src/app/models/subindicators';
import { TypeID } from 'src/app/models/type';
import { IndicatorInstanceService } from 'src/app/services/indicator-instance/indicator-instance.service';
import { SubindicatorService } from 'src/app/services/subindicator/subindicator.service';
import { TypeService } from 'src/app/services/type/type.service';
import { from, of, EMPTY } from 'rxjs';
import { EvidenceService } from 'src/app/services/evidence/evidence.service';
import { UserService } from 'src/app/services/user/user.service';
import { User, UserID } from 'src/app/models/user';
import { dataSubindicator } from '../../component/add-subindicator-data/add-subindicator-data.component';
import { EvidenceSubindicator } from '../../component/add-subindicator-evidences/add-subindicator-evidences.component';
import { TitleService } from 'src/app/services/title/title.service';
import { IndicatorID } from 'src/app/models/indicator';

@Component({
  selector: 'app-add-subindicator',
  templateUrl: './add-subindicator.component.html',
  styleUrls: ['./add-subindicator.component.scss']
})
export class AddSubindicatorComponent implements OnInit {
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;
  @ViewChild('Entrada') panel1!: MatExpansionPanel
  @ViewChild('Ejecución') panel2!: MatExpansionPanel
  @ViewChild('Finalización') panel3!: MatExpansionPanel

  portada: CharacteristicID = {
    group: '0',
    groupName: 'Suba la infografia/portada del proyecto',
    id: '',
    isRequired: true,
    name: 'Portada',
    required: true,
    tier: 1,
    unique: true,
    allowed_formats:['.pdf']
  }
  nameControl = new FormControl('')
  typeControl = new FormGroup({
    type: new FormControl()
  })
  responsibleControl = new FormControl('')
  types: TypeID[] = []
  step:number=0
  arrayEvidence: Evidence[] = []
  characteristics: CharacteristicID[] = []
  group1: CharacteristicID[] = []
  group2: CharacteristicID[] = []
  group3: CharacteristicID[] = []
  indicatorInstance!: IndicatorInstanceID
  user!:UserID
  //step1
  typeSelected!:TypeID
  nameSelected!:string
  responsibleSelected!:string
  isPlanned:boolean = false
  isDiagnosed:boolean = false
  portadaArray!: Evidence[]
  //event evidences
  constructor(
    private typeService: TypeService,
    private location: Location,
    private viewportScroller: ViewportScroller,
    private indicatorInstanceSevice: IndicatorInstanceService,
    private subindicatorService: SubindicatorService,
    private evidenceService: EvidenceService,
    private userService:UserService,
    private titleService:TitleService
  ) { }

  stepChange(step:number){
    this.step=step
  }

  stepAddEvidences(dataRecive:dataSubindicator){
    if(dataRecive.flag){
      this.step=1
      this.typeSelected=dataRecive.data.type
      this.nameSelected=dataRecive.data.name
      this.responsibleSelected=dataRecive.data.responsible
      this.isPlanned=dataRecive.data.isPlanned!
      this.isDiagnosed=dataRecive.data.isDiagnosed!
      if(dataRecive.data.portada){
        this.portadaArray=dataRecive.data.portada
      }
    }
  }
  stepConfirmSubindicator(data:EvidenceSubindicator){
    if(data.flag){
      this.step=2
      this.arrayEvidence=data.data.evidences
    }else{
      this.step=0
    }
  }

  saveEvidence() {
    const newSubindicator: Subindicator = {
      commits: [],
      cover: this.portadaArray[0].link as string,
      requireCover: true,
      observationCover: this.portadaArray[0].note,
      isDiagnosed:this.isDiagnosed,
      isPlanned:this.isPlanned,
      created: new Date(),
      evidences: [],
      indicadorID: this.indicatorInstance.id,
      lastUpdate: new Date(),
      state:false,
      name: this.name,
      qualification: 0,
      responsible: this.responsible,
      typeID: this.type.id,
    }
    
    this.subindicatorService.addSubindicator(newSubindicator).pipe(
      mergeMap(subindicator => {
       
        return of(subindicator).pipe(
          mergeMap(subindicator => {
            this.arrayEvidence = this.arrayEvidence.map(evidence => {
              evidence.subIndicatorID = subindicator.id;
              return evidence;
            });
            return from(this.arrayEvidence).pipe(
              concatMap(evidence => {
                return this.evidenceService.addEvidence(evidence).pipe(
                  catchError(error => {
                    console.error('Error al agregar la evidencia', error);
                    return EMPTY;
                  })
                );
              })
            );
          }),
          catchError(error => {
            console.error('Error al agregar el subindicador', error);
            return EMPTY;
          })
        );
      })
    ).subscribe(
      error => {
        console.error('Error al agregar el subindicador y evidencias', error);
      }
    );
  }
  cancelEvidence() {
    this.location.back()
  }

  handlePortada(event: Evidence[]) {
    this.portadaArray = event
  }

  ngOnInit(): void {
    this.typeService.getTypeByMandatory(false).subscribe(
      types => {
        this.types = types
      }
    )
    this.indicatorInstanceSevice.getIndicatorInstance().subscribe(
      indicatorInstance => {
        this.indicatorInstance = indicatorInstance
        const indicatorCatalog = indicatorInstance.indicatorID as IndicatorID
        this.titleService.setTitle([indicatorCatalog.quadrantName,indicatorCatalog.name,'Subindicadores Especificos','Añadir Subindicador'])

      }
    )
    this.userService.getUserSesion().subscribe(user=>this.user=user)
  }

  get name() {
    return this.nameControl.value
  }

  get type() {
    return this.typeControl.get('type')?.value
  }

  get responsible() {
    return this.responsibleControl.value
  }


}
