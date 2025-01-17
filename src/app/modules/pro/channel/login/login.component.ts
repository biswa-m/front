import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Session } from '../../../../services/session';
import { ProChannelService } from '../channel.service';
import { Storage } from '../../../../services/storage';

@Component({
  selector: 'm-pro--channel-login',
  templateUrl: 'login.component.html',
})
export class ProChannelLoginComponent {
  username: string;
  currentSection: 'login' | 'register' = 'login';

  paramsSubscription: Subscription;

  redirectTo: string;

  get settings() {
    return this.service.currentChannel.pro_settings;
  }

  get referrer() {
    return this.service.currentChannel.username;
  }

  constructor(
    public session: Session,
    public service: ProChannelService,
    private router: Router,
    private route: ActivatedRoute,
    private storage: Storage
  ) {
    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['username']) {
        this.username = params['username'];
      }

      if (this.session.isLoggedIn()) {
        this.router.navigate(this.service.getRouterLink('home'));
      }
    });
  }

  ngOnInit() {
    this.redirectTo = this.storage.get('redirect');
  }

  registered() {
    if (this.redirectTo) {
      this.storage.destroy('redirect');
      this.router.navigate([this.redirectTo]);
      return;
    }

    this.router.navigate(this.service.getRouterLink('home'));
  }
}
