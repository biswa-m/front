import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { GroupsService } from '../../groups-service';
import { Session } from '../../../../services/session';
import { Router } from '@angular/router';
import { Client } from '../../../../services/api/client';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-groups-profile__review',
  templateUrl: 'review.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsProfileReviewComponent implements OnInit {
  group: any;
  group$: Subscription;

  entities: any[] = [];
  pinned: any[] = [];

  inProgress: boolean = false;
  moreData: boolean = true;
  offset: any = '';

  initialized: boolean = false;

  kicking: any;

  constructor(
    protected service: GroupsService,
    protected session: Session,
    protected router: Router,
    protected client: Client,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initialized = true;

    this.group$ = this.service.$group.subscribe(group => {
      this.group = group;
      this.load(true);
    });
  }

  async load(refresh: boolean = false) {
    if (!this.group) {
      return;
    }

    if (!refresh && this.inProgress) {
      return;
    }

    if (refresh) {
      this.entities = [];
      this.moreData = true;
      this.offset = '';
    }

    this.inProgress = true;

    this.detectChanges();

    try {
      const params: any = {
        limit: 12,
        offset: this.offset,
      };

      const response: any = await this.client.get(
        `api/v1/groups/review/${this.group.guid}`,
        params
      );

      if (typeof response['adminqueue:count'] !== 'undefined') {
        this.group['adminqueue:count'] = response['adminqueue:count'];
      }

      const entities = (response || {}).activity || [];
      const next = (response || {})['load-next'] || '';

      if (this.entities && !refresh) {
        this.entities.push(...entities);
      } else {
        this.entities = entities;
      }

      if (!next) {
        this.moreData = false;
      }

      this.offset = next;
    } catch (e) {
      console.error('GroupProfileFeedSortedComponent.loadReviewQueue', e);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  delete(activity) {
    let i: any;

    for (i in this.entities) {
      if (this.entities[i] === activity) {
        this.entities.splice(i, 1);
        break;
      }
    }

    for (i in this.pinned) {
      if (this.pinned[i] === activity) {
        this.pinned.splice(i, 1);
        break;
      }
    }
  }

  async approve(activity, index: number) {
    if (!activity) {
      return;
    }

    this.entities.splice(index, 1);

    try {
      await this.client.put(
        `api/v1/groups/review/${this.group.guid}/${activity.guid}`
      );

      this.group['adminqueue:count'] = this.group['adminqueue:count'] - 1;
    } catch (e) {
      alert((e && e.message) || 'Internal server error');
    }
  }

  async reject(activity, index: number) {
    if (!activity) {
      return;
    }

    this.entities.splice(index, 1);

    try {
      await this.client.delete(
        `api/v1/groups/review/${this.group.guid}/${activity.guid}`
      );

      this.group['adminqueue:count'] = this.group['adminqueue:count'] - 1;
    } catch (e) {
      alert((e && e.message) || 'Internal server error');
    }
  }

  kick(user: any) {
    this.kicking = user;
  }

  //

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
