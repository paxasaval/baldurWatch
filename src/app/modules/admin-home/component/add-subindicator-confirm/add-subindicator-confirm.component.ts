import { StorageService } from 'src/app/services/storage/storage.service';
import { mergeMap, concatMap, catchError,reduce } from 'rxjs/operators';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CharacteristicID, CharacteristicWithEvidence } from 'src/app/models/characteristic';
import { Evidence } from 'src/app/models/evidence';
import { IndicatorInstanceID } from 'src/app/models/indicatorInstance';
import { Subindicator } from 'src/app/models/subindicators';
import { TypeID } from 'src/app/models/type';
import { UserID } from 'src/app/models/user';
import { SubindicatorService } from 'src/app/services/subindicator/subindicator.service';
import { EMPTY, from, of } from 'rxjs';
import { EvidenceService } from 'src/app/services/evidence/evidence.service';
import Swal from 'sweetalert2';
import { IndicatorInstanceService } from 'src/app/services/indicator-instance/indicator-instance.service';
import { Router } from '@angular/router';
import { IndicatorID } from 'src/app/models/indicator';
import { GadID } from 'src/app/models/gad';

@Component({
  selector: 'app-add-subindicator-confirm',
  templateUrl: './add-subindicator-confirm.component.html',
  styleUrls: ['./add-subindicator-confirm.component.scss']
})
export class AddSubindicatorConfirmComponent implements OnInit,OnChanges {

  @Input() type!:TypeID
  @Input() name!:string
  @Input() responsible!:string
  @Input() portada!:Evidence[]
  @Input() evidences!:Evidence[]

  groupData: CharacteristicWithEvidence[] = []
  user!:UserID
  indicatorInstance!:IndicatorInstanceID
  indicatorCatalog!:IndicatorID
  gadID!:GadID

  constructor(
    private subindicatorService:SubindicatorService,
    private evidenceService:EvidenceService,
    private storageService:StorageService,
    private indicatorInstanceSevice:IndicatorInstanceService,
    private router:Router
    ) { }

  groupCharacteristics(typeID: TypeID, evidences: Evidence[]): CharacteristicWithEvidence[] {
    console.log(evidences)
    const characteristics = typeID.characteristics as CharacteristicID[]
    return characteristics.map((characteristic) => {
      const evidenceArray = evidences.filter(evidence => {
        const characteristicID = evidence.characteristicID
        return characteristicID == characteristic.id
      })

      return { characteristic: characteristic, evidences: evidenceArray }
    })
  }

  saveEvidence() {
    Swal.fire({
      title:'Creando subindicador',
      didOpen:()=>{
        Swal.showLoading()
      }
    })
    const newSubindicator: Subindicator = {
      commits: [],
      cover: '',
      requireCover: true,
      observationCover: this.portada[0].note ||'',
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
    if(this.portada[0].link instanceof File){
      this.storageService.uploadFile('test',this.portada[0].link)
      .then(url=>{
        newSubindicator.cover=url
        console.log('portada guardada en: ',url)
      })
    }else{
      newSubindicator.cover=this.portada[0].link as string
    }
    console.log(newSubindicator)
    console.log(this.evidences)
    this.subindicatorService.addSubindicator(newSubindicator).pipe(
      mergeMap(subindicator => {
        console.log('subindicador subido con exito!')
        return of(subindicator).pipe(
          mergeMap(subindicator => {
            this.evidences = this.evidences.map(evidence => {
              evidence.subIndicatorID = subindicator.id;
              return evidence;
            });
            return from(this.evidences).pipe(
              concatMap(evidence => {
                if(evidence.link instanceof File){
                  const indicatorCatalog = this.indicatorInstance.indicatorID as IndicatorID
                  console.log(this.indicatorInstance.gadID)
                  const path = this.gadID.name+'/'+this.indicatorInstance.year+'/'+indicatorCatalog.quadrantName+'/'+indicatorCatalog.name+'/'+subindicator.name
                  return from(this.storageService.uploadFile(path,evidence.link)).pipe(
                    concatMap((url)=>{
                      evidence.link=url
                      return this.evidenceService.addEvidence(evidence)
                    })
                  )
                }else{
                return this.evidenceService.addEvidence(evidence).pipe(
                  catchError(error => {
                    console.error('Error al agregar la evidencia', error);
                    return EMPTY;
                  })
                )};
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
      () => {
        console.log('Todas las evidencias agregados al subindicador con éxito');
        Swal.close()
        const currentURL = this.router.url
        const segments = currentURL.split('/');
        segments.pop(); // Elimina el último segmento (parámetro) de la ruta

        const newUrl = segments.join('/');
        this.router.navigateByUrl(newUrl);
      },
      error => {
        console.error('Error al agregar el subindicador y evidencias', error);
        Swal.close()
        Swal.fire(
          'Error: Lo sentimos no se ha podido completar su peticion',
          '',
          'error'
        )
      }
    );
  }

  ngOnChanges(changes:SimpleChanges){
    this.groupData = this.groupCharacteristics(this.type,this.evidences)
  }
  ngOnInit(): void {
    this.indicatorInstanceSevice.getIndicatorInstance().subscribe(
      indicator=>{
        console.log(indicator)
        this.indicatorInstance = indicator
        this.indicatorCatalog = indicator.indicatorID as IndicatorID
        this.gadID = indicator.gadID as GadID
      }
    )
  }

}
