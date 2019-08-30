import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProChannelService } from '../channel.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';

@Component({
  selector: 'm-pro--channel-home',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: 'home.component.html',
})
export class ProChannelHomeComponent implements OnInit {
  inProgress: boolean = false;

  featuredContent: Array<any> = [];

  categories: Array<{
    tag: { tag: string; label: string };
    content: Array<Observable<any>>;
  }> = [];

  moreData: boolean = true;

  constructor(
    protected router: Router,
    protected channelService: ProChannelService,
    protected modalService: OverlayModalService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    const MAX_FEATURED_CONTENT = 17; // 1 + (8 * 2)

    this.inProgress = true;
    this.featuredContent = [];
    this.categories = [];
    this.moreData = true;

    this.detectChanges();

    try {
      this.featuredContent = await this.channelService.getFeaturedContent();
      this.detectChanges();

      const { content } = await this.channelService.getContent({
        limit: MAX_FEATURED_CONTENT,
      });
      this.featuredContent = this.featuredContent
        .concat(content)
        .slice(0, MAX_FEATURED_CONTENT);
      this.detectChanges();

      this.categories = await this.channelService.getAllCategoriesContent();
      this.detectChanges();
    } catch (e) {
      this.moreData = false;
    }

    this.inProgress = false;
    this.detectChanges();
  }

  getCategoryRoute(tag) {
    if (!this.channelService.currentChannel || !tag) {
      return [];
    }

    return this.channelService.getRouterLink('all', { hashtag: tag });
  }

  onContentClick(entity: any) {
    return this.channelService.open(entity, this.modalService);
  }

  navigateToCategory(tag) {
    this.router.navigate(
      this.channelService.getRouterLink('all', { hashtag: tag })
    );
  }

  get settings() {
    return (
      this.channelService.currentChannel &&
      this.channelService.currentChannel.pro_settings
    );
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}