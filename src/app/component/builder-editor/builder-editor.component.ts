import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ISection } from 'src/app/models/section.model';
import { MenuChildAddNew } from 'src/app/constant/left-menu.constant';

@Component({
  selector: 'app-builder-editor',
  templateUrl: './builder-editor.component.html',
  styleUrls: ['./builder-editor.component.scss'],
})
export class BuilderEditorComponent implements OnInit, OnDestroy {
  public sectionArray: ISection[] = [];

  private _selectSelectedId: number | null;
  private _count: number;
  private _selectSelectedIndex: number | null;
  private _subjectOnDestroy: Subject<any> = new Subject();
  @ViewChild('sectionResize') sectionResize: ElementRef;
  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this._count = 10;
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

  setHeightSection(height: number) {
    this.sectionArray[this._selectSelectedIndex].height = height;
  }
  setIndexSelect(index) {
    this._selectSelectedIndex = index;
    console.log(this._selectSelectedIndex);
  }

  addElement(datakey: MenuChildAddNew) {
    console.log(datakey);
  }
}
