import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-idle-time-out',
  templateUrl: './idle-time-out.component.html',
  styleUrls: ['./idle-time-out.component.scss']
})
export class IdleTimeOutComponent implements OnInit {

  idleState = "NOT_STARTED";
  countdown: any = null;
  lastPing: any = null;
  // add parameters for Idle and Keepalive (if using) so Angular will inject them from the module
  constructor(private idle: Idle, keepalive: Keepalive, cd: ChangeDetectorRef,private router:Router ,private auth: AuthService) {
    // set idle parameters
    // idle.setIdle(540); // how long can they be inactive before considered idle, in seconds
    idle.setIdle(540);
    idle.setTimeout(60); // how long can they be idle before considered timed out, in seconds
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active

    // do something when the user becomes idle
    idle.onIdleStart.subscribe(() => {
      this.idleState = "IDLE";
    });
    // do something when the user is no longer idle
    idle.onIdleEnd.subscribe(() => {
      this.idleState = "NOT_IDLE";
      // console.log(`${this.idleState} ${new Date()}`)
      this.countdown = null;
      cd.detectChanges(); // how do i avoid this kludge?
    });
    // do something when the user has timed out
    idle.onTimeout.subscribe(() =>
      // this.idleState = "TIMED_OUT",
      this.signOut()
    );
    // do something as the timeout countdown does its thing
    let isOpen=false;
    idle.onTimeoutWarning.subscribe((seconds:any) => {
      // this.countdown = 'You will time out in ' + seconds + ' seconds!';
      this.countdown =  seconds ;
      
    });

    // set keepalive parameters, omit if not using keepalive
    keepalive.interval(15); // will ping at this interval while not idle, in seconds
    keepalive.onPing.subscribe(() => this.lastPing = new Date()); // do something when it pings
  }

  reset() {
    // we'll call this method when we want to start/reset the idle process
    // reset any component state and be sure to call idle.watch()
    this.idle.watch();
    this.idleState = "NOT_IDLE";
    this.countdown = null;
    this.lastPing = null;
  }

  ngOnInit(): void {
    // right when the component initializes, start reset state and start watching
    this.reset();
    // timer(10)
  }
  signOut() {
    this.idle.watch();
    this.auth.signOut();
    // window.sessionStorage.clear();
    // window.location.reload();
    // window.location.reload();
    // this.router.navigate(['/login']);
  }
  
}