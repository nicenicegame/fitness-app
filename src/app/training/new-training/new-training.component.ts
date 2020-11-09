import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";

import { TrainingService } from "../training.service";
import { Subscription } from "rxjs";
import { Exercise } from "../exercise.model";
import { UIService } from "../../shared/ui.service";

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  private exerciseSubscription: Subscription;
  isLoading = false;
  private loadingSubs: Subscription;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService
  ) {}

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(
      (loadingState) => {
        this.isLoading = loadingState;
      }
    );
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      (exercises) => {
        this.exercises = exercises;
      }
    );
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
    this.loadingSubs.unsubscribe();
  }
}
