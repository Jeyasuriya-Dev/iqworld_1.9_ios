import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  

  ngOnInit() {
    // this.start();
  }
  intervalId = 0;
  message = '';
  seconds = 60;

  clearTimer() {
    clearInterval(this.intervalId);
  }
  ngOnDestroy() {
    this.clearTimer();
  }

  start() {
    this.countDown();
  }
  stop() {
    this.clearTimer();
    this.message = `Holding at T-${this.seconds} seconds`;
  }

  private countDown() {
    this.clearTimer();
    this.intervalId = window.setInterval(() => {
      this.seconds -= 1;

      if (this.seconds < 0) {
        this.seconds = 60;
      } // reset
      this.message = `${this.seconds}s`;
      if(this.seconds === 0){
          window.location.reload();
      }
    }, 1000);
  }
}

