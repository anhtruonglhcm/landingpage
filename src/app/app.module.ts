import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DraggingDirective } from './directives/dragging.directive';
import { LeftMenuComponent } from './component/left-menu/left-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RightMenuComponent } from './component/right-menu/right-menu.component';
import { BuilderEditorComponent } from './component/builder-editor/builder-editor.component';
import { SectionDirective } from './directives/section.directive';
import { QuickEditorComponent } from './component/quick-editor/quick-editor.component';
import { QuickEditorDirective } from './directives/quick-editor.directive';
import { ColorEditorComponent } from './component/quick-editor/color-editor/color-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    DraggingDirective,
    LeftMenuComponent,
    RightMenuComponent,
    BuilderEditorComponent,
    SectionDirective,
    QuickEditorComponent,
    QuickEditorDirective,
    ColorEditorComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, DragDropModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
