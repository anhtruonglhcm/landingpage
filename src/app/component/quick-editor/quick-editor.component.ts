import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quick-editor',
  templateUrl: './quick-editor.component.html',
  styleUrls: ['./quick-editor.component.scss'],
})
export class QuickEditorComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  deleteElement(event: MouseEvent) {
    event.stopPropagation();
    console.log('deleted');
  }
}
