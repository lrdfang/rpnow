import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { RpVoice, RpService, RpChara } from '../../rp.service';
import { CharaSelectorService } from '../chara-selector.service';
import { MatDialog } from '@angular/material/dialog';
import { NewCharaComponent } from '../new-chara/new-chara.component';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'chara-drawer-contents',
  templateUrl: 'chara-drawer.html',
  styles: []
})
export class CharaDrawerComponent implements OnInit {

  public currentChara$: BehaviorSubject<RpVoice>;
  public recentCharas$: Observable<RpChara[]>;
  public allCharas$: Observable<RpChara[]>;

  public hasManyCharacters$: Observable<boolean>;

  constructor(
    public rp: RpService,
    private charaSelectorService: CharaSelectorService,
    private dialog: MatDialog,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this.currentChara$ = this.charaSelectorService.currentChara$;

    this.recentCharas$ = this.currentChara$
      .filter(chara => typeof chara !== 'string')
      .scan((arr:RpChara[], chara:RpChara) => [
        chara, ...arr.filter(c => c.id !== chara.id)
      ].slice(0,5), [])
      .map((charas:RpChara[]) => [...charas].sort((a,b) => a.name.localeCompare(b.name))) as Observable<RpChara[]>

    this.allCharas$ = this.rp.charas$.map(charas => [...charas].sort((a,b) => a.name.localeCompare(b.name)))

    this.hasManyCharacters$ = this.rp.charas$.map(charas => charas.length >= 10);
  }

  public setVoice(voice: RpVoice) {
    this.charaSelectorService.currentChara$.next(voice);
  }

  public newChara() {
    let dialogRef = this.dialog.open(NewCharaComponent, { viewContainerRef: this.viewContainerRef });
    dialogRef.beforeClose().subscribe(chara => {
      if (chara) this.charaSelectorService.currentChara$.next(chara);
    })
  }

  close() {
    this.charaSelectorService.menu.close();
  }

}
