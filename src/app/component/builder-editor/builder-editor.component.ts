import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { interval, Subject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ISection } from 'src/app/models/section.model';
import { MenuChildAddNew } from 'src/app/constant/left-menu.constant';
import {
  BUTTON_DEFAULT,
  HEADLINE_DEFAULT,
} from 'src/app/constant/element.constant';
import { IWigetButton } from 'src/app/models/wiget-button.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-builder-editor',
  templateUrl: './builder-editor.component.html',
  styleUrls: ['./builder-editor.component.scss'],
})
export class BuilderEditorComponent implements OnInit, OnDestroy {
  @ViewChild('quickEditor', { static: true }) quickEditor: ElementRef;
  public sectionArray: ISection[] = [];
  public hasSelectedElement: boolean;
  public quickEditorTop = 0;
  public quickEditorLeft = 0;
  public isDrag = true;
  // public TypeElement = TypeElement;
  public MenuChildAddNew = MenuChildAddNew;
  private _selectSelectedId: number | null;
  private _count: number;
  private _selectSelectedIndex: number | null;
  private _subjectOnDestroy: Subject<any> = new Subject();
  private _innerWidth: number;
  @ViewChild('sectionResize') sectionResize: ElementRef;
  constructor(
    private commonService: CommonService,
    private renderer2: Renderer2,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this._count = 10;
    this._innerWidth = window.innerWidth;
    this.hasSelectedElement = false;
  }
  ngOnDestroy(): void {
    this._subjectOnDestroy.next();
    this._subjectOnDestroy.complete();
  }
  addNewSection() {
    this.sectionArray.push({
      id: this._count,
      idSection: `SECTION${this._count}`,
      height: 360,
      element: [],
    });
    this._count++;
  }

  setSelectSelected(id: number | null) {
    // if (this._selectSelectedId === id) return;
    // this._selectSelectedId = id;
    // this._selectSelectedIndex = this.sectionArray.findIndex(
    //   (section) => section.id === id
    // );
  }
  setIsDrag(isDrag: boolean) {
    this.isDrag = isDrag;
  }
  setPositionQuickEditor(top: number, left: number) {
    this.quickEditorTop = top;
    this.quickEditorLeft = left;
  }

  setHeightSection(height: number) {
    this.sectionArray[this._selectSelectedIndex].height = height;
  }
  setIndexSelect(index) {
    this._selectSelectedIndex = index;
  }

  setHasSelected(isSelected: boolean) {
    this.hasSelectedElement = isSelected;
  }

  addElement(elementType: MenuChildAddNew) {
    console.log(elementType);
    if (this.sectionArray.length === 0) {
      this.addNewSection();
    }
    switch (elementType) {
      case MenuChildAddNew.BUTTON: {
        this.sectionArray[this._selectSelectedIndex | 0].element.push({
          id: this._count,
          idSection: this._selectSelectedIndex | 0,
          height: BUTTON_DEFAULT.HEIGHT,
          width: BUTTON_DEFAULT.WIDTH,
          top:
            (this.sectionArray[this._selectSelectedIndex | 0].height -
              BUTTON_DEFAULT.HEIGHT) /
            2,
          left: (this._innerWidth - BUTTON_DEFAULT.WIDTH) / 2,
          elementType: MenuChildAddNew.BUTTON,
          innerHtml: BUTTON_DEFAULT.INNER_HTML,
        });
        this._count++;
        break;
      }

      case MenuChildAddNew.TITLE: {
        this.sectionArray[this._selectSelectedIndex | 0].element.push({
          id: this._count,
          idSection: this._selectSelectedIndex | 0,
          width: HEADLINE_DEFAULT.WIDTH,
          top:
            (this.sectionArray[this._selectSelectedIndex | 0].height -
              HEADLINE_DEFAULT.HEIGHT) /
            2,
          left: (this._innerWidth - HEADLINE_DEFAULT.WIDTH) / 2,
          elementType: MenuChildAddNew.TITLE,
          innerHtml: HEADLINE_DEFAULT.INNER_HTML,
        });
        this._count++;
        break;
      }
    }
  }

  blur(event, indexElement: number, indexSection: number) {
    (
      this.sectionArray[indexSection].element[indexElement] as IWigetButton
    ).innerHtml = event.target.innerText;
    console.log(this.sectionArray);
  }
}

// kk
// [innerHTML]="itemElement.innerHtml"
// (blur)="blur($event, indexElement, indexSection)"
