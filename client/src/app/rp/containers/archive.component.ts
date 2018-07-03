import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RpService } from '../services/rp.service';
import { MainMenuService } from '../services/main-menu.service';
import { OptionsService } from '../services/options.service';
import { RpMessageId } from '../models/rp-message';
import { RpPageResponse, RoomService } from '../services/room.service';
import { RpCodeService } from '../services/rp-code.service';
import { Observable, merge, of } from 'rxjs';
import { map, switchMap, share } from 'rxjs/operators';

@Component({
  selector: 'rpn-archive',
  template: `
    <rpn-title-bar [title]="(pageInfo$|async)?.title" [desc]="(pageInfo$|async)?.desc" (clickMenu)="openMenu()" style="z-index:1"></rpn-title-bar>

    <rpn-paginator [pageNum]="(pageNum$|async)" [pageCount]="(pageInfo$|async)?.pageCount" (pageNumChange)="pageNumChange($event)"></rpn-paginator>

    <rpn-message-list class="flex-scroll-container" #messageContainer
      [messages]="(pageInfo$|async)?.msgs"
      [charas]="(pageInfo$|async)?.charas"
      [challenge]="(options.challenge$|async).hash"
      [showMessageDetails]="options.showMessageDetails$|async"
      [pressEnterToSend]="options.pressEnterToSend$|async"
      (editMessageContent)="editMessageContent($event[0], $event[1])"
    ></rpn-message-list>
  `,
  styles: [`
    :host {
      flex: 1;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchiveComponent implements OnInit {

  @ViewChild('messageContainer', { read: ElementRef }) messageContainer: ElementRef;

  pageNum$: Observable<number>;
  pageInfo$: Observable<RpPageResponse>;

  constructor(
    private rp: RpService,
    private rpCodeService: RpCodeService,
    private roomService: RoomService,
    public options: OptionsService,
    public mainMenuService: MainMenuService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.pageNum$ = this.route.paramMap.pipe(
      map(params => +params.get('page'))
    );

    this.pageInfo$ = this.pageNum$.pipe(
      switchMap(pageNum => merge(
        of(null),
        this.roomService.getPage(this.rpCodeService.rpCode, pageNum)
      )),
      share()
    );
  }

  pageNumChange(page: number) {
    this.router.navigate(['../', page], { relativeTo: this.route });
    (this.messageContainer.nativeElement as HTMLElement).scrollTop = 0;
  }

  openMenu() {
    this.mainMenuService.menu.open();
  }

  editMessageContent(id: RpMessageId, content: string) {
    this.rp.editMessage(id, content);
  }

}
