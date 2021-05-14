import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-quick-editor',
  templateUrl: './quick-editor.component.html',
  styleUrls: ['./quick-editor.component.scss'],
})
export class QuickEditorComponent implements OnInit, OnChanges {
  @Input('quickEditorTop') quickEditorTop: number;
  @Input('quickEditorLeft') quickEditorLeft: number;
  constructor() {}

  ngOnInit(): void {}
  deleteElement(event: MouseEvent) {
    event.stopPropagation();
    console.log('deleted');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.quickEditorTop);
  }
}
