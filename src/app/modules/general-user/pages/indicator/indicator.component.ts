import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { IndicatorID } from 'src/app/models/indicator';
import { IndicatorInstanceID } from 'src/app/models/indicatorInstance';
import { IndicatorInstanceService } from 'src/app/services/indicator-instance/indicator-instance.service';
import { IndicatorsService } from 'src/app/services/indicators/indicators.service';
import { PeriodService } from 'src/app/services/period/period.service';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit, AfterViewInit {

  indicatorInstance!: IndicatorInstanceID

  constructor(
    private route: ActivatedRoute,
    private indicatorInstanceService: IndicatorInstanceService,
    private indicatorService: IndicatorsService,
    private periodService: PeriodService,
    private router: Router
  ) { }
  ngAfterViewInit(): void {

  }
  ngOnInit(): void {
    this.route.parent?.params.pipe(
      switchMap(paramsParent => {
        const quadrant = paramsParent['quadrantNumber'] as number
        return this.route.params.pipe(
          switchMap(params => {
            console.log(params)
            const number = params['indicatorNumber'] as number
            console.log(quadrant, number)
            return this.indicatorService.getIndicatorByQuadrantAndNumber(quadrant, number).pipe(
              switchMap(indicator => {
                return this.periodService.getPeriodSelected().pipe(
                  switchMap(period => {
                    return this.indicatorInstanceService.getIndicatorByIndicatorIDandPeriod(indicator.id, period)
                  })
                )
              })
            )
          })
        )
      })
    ).subscribe(
      indicatorInstance => {
        this.indicatorInstance = indicatorInstance
        this.indicatorInstanceService.setIndicatorInstance(indicatorInstance)
        if (this.indicatorInstance) {
          console.log(indicatorInstance)
          const indicatorCatalog = this.indicatorInstance.indicatorID as IndicatorID
          this.router.navigateByUrl(`user/quadrant/${indicatorCatalog.quadrant}/indicator/${indicatorCatalog.number}/${indicatorInstance.id}`)
        }
      }
    )
  }

}