import { concatMap, mergeMap } from 'rxjs/operators';
import { Observable, Subscription, combineLatest, of, EMPTY } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IndicatorInstanceID } from 'src/app/models/indicatorInstance';
import { SubindicatorID } from 'src/app/models/subindicators';
import { TypeID } from 'src/app/models/type';
import { IndicatorsService } from 'src/app/services/indicators/indicators.service';
import { SubindicatorService } from 'src/app/services/subindicator/subindicator.service';
import { TitleService } from 'src/app/services/title/title.service';
import { IndicatorInstanceService } from 'src/app/services/indicator-instance/indicator-instance.service';
import { TypeService } from 'src/app/services/type/type.service';
import { IndicatorID } from 'src/app/models/indicator';

@Component({
  selector: 'app-subindicator-general',
  templateUrl: './subindicator-general.component.html',
  styleUrls: ['./subindicator-general.component.scss']
})
export class SubindicatorGeneralComponent implements OnInit,OnDestroy {

  subIndicator!: SubindicatorID
  flag:boolean=false
  indicator!: IndicatorInstanceID
  type!: TypeID
  observer!:Subscription
  subindicatorSubscribe!:Subscription
  list:string[] = []
  constructor(
    private router:Router,
    private titleService:TitleService,
    private indicatorService:IndicatorInstanceService,
    private subindicatorService:SubindicatorService,
    private typeService:TypeService
  ) { }

  ngOnInit(): void {
    this.observer=combineLatest([
      this.indicatorService.getIndicatorInstance(),
      this.subindicatorService.getSelectedSubindicator(),
      this.typeService.getTypeSelected()
    ])
      .subscribe(([indicator,subindicator,type])=>{
        this.subIndicator= subindicator
        if(subindicator.extraInfo){
          console.log(subindicator.extraInfo)
          this.list = subindicator.extraInfo![2].valor as string[]

        }
        const indicatorCatalog = indicator.indicatorID as IndicatorID
        //this.titleService.setTitle([indicatorCatalog.quadrantName,indicatorCatalog.name,type.name])
      })
  }

  handleQualify(flag:boolean){
    if (flag) {
      //console.log(this.subIndicator)//Estado anterior
        this.subindicatorService.getSubindicatorByID(this.subIndicator.id)
        .pipe(
          mergeMap(subindicator => {
            console.log(subindicator)//Actual
            this.subindicatorService.setSelectedSubindicator(subindicator);
            return EMPTY; // O cualquier otro observable que desees retornar, como of(null)
          })
        )
        .subscribe(res => {
          //console.log(res);
        });
    }
  }
  ngOnDestroy(): void {
      this.observer.unsubscribe()
  }

}
