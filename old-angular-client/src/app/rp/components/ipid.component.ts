import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'rpn-ipid',
  template: `
    <span class="color-ip-box" matTooltip="Anonymous user ID">
      <span class="color-ip-box-section" *ngFor="let color of colors; trackBy: trackBySelf" [style.background-color]="color"></span>
    </span>
  `,
  styles: [`
    .color-ip-box {
      display: inline-block;
      vertical-align: middle;
      height: 8px;
      width: 18px;
      border: solid 1px rgba(0,0,0,0.7);
      margin: -2px 4px 0 10px;
      position: relative;
    }
    .color-ip-box-section {
      display: inline-block;
      vertical-align: top;
      padding: 0;
      margin: 0;
      width: 6px;
      height: 100%;
    }
    :host-context(.dark-theme) .color-ip-box {
      border-color: rgba(255,255,255,0.7);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IpidComponent {

  colors: string[] = [];

  @Input('ipid') set ipid(ipid: string) {
    if (!ipid) return;
    this.colors = ipid.match(/[0-9a-f]{6}/gi).map(hex => '#' + hex);
  }

  trackBySelf(color: string) {
    return color;
  }

}
