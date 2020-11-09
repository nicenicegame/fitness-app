import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';
import { UIService } from '../../shared/ui.service';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  private exChangedSubscription: Subscription
  private loadingSubs: Subscription
  isLoading = false

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private trainingService: TrainingService, private uiService: UIService) {}

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(loadingState => {
      this.isLoading = loadingState
    })
    this.exChangedSubscription = this.trainingService.finishedExercisesChanged.subscribe((exercises: Exercise[]) => {
      this.dataSource.data = exercises
    })
    this.trainingService.fetchCompletedOrCancelledExercises()
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.exChangedSubscription.unsubscribe()
    this.loadingSubs.unsubscribe()
  }
}
