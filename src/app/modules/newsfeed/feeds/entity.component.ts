import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ChangeDetectorRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';

import { ChannelsTileComponent } from '../../channels/tile/tile.component';
import { GroupsTileComponent } from '../../groups/tile/tile.component';
import { DynamicHostDirective } from '../../../common/directives/dynamic-host.directive';

@Component({
  selector: 'm-newsfeed__entity',
  templateUrl: 'entity.component.html',
})
export class NewsfeedEntityComponent {
  @Output() deleted = new EventEmitter<boolean>();
  @ViewChild(DynamicHostDirective, { static: false })
  host: DynamicHostDirective;
  entity;

  constructor(
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected cd: ChangeDetectorRef
  ) {}

  @Input('entity') set setEntity(entity) {
    this.entity = entity;
    this.updateComponents();
  }

  // Return the component to use
  private getComponent(type: string) {
    return type === 'user' ? ChannelsTileComponent : GroupsTileComponent;
  }

  @Input() slot: number;

  // Clear the view container
  clear() {
    this.cd.detectChanges();
    this.cd.markForCheck();
    if (this.host) this.host.viewContainerRef.clear();
  }

  // Update the component
  updateComponents() {
    if (
      this.entity &&
      (this.entity.type === 'user' || this.entity.type === 'group')
    ) {
      this.clear();

      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        this.getComponent(this.entity.type)
      );

      let componentRef: ComponentRef<any> = this.host.viewContainerRef.createComponent(
        componentFactory
      );
      componentRef.instance.entity = this.entity;
      componentRef.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Sets entity to null and by extension hides it.
   */
  delete(): void {
    this.entity = null;
    this.deleted.emit(true);
  }
}
