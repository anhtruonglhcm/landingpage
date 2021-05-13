import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { BuilderEditorComponent } from '../component/builder-editor/builder-editor.component';
import { QuickEditorDirective } from './quick-editor.directive';

@Directive({
  selector: '[appDragging]',
})
export class DraggingDirective implements OnInit, OnChanges, OnDestroy {
  private element: HTMLElement;
  private subscriptions: Subscription[] = [];
  private wresize: HTMLElement;
  private eresize: HTMLElement;
  private selected: HTMLElement;
  private eleResize = ['ladi-e-resize', 'ladi-w-resize'];
  private _elementEditor: HTMLElement;
  private _elementHover: HTMLElement;
  private _elementSelected: HTMLElement;

  private _dataId: string;
  constructor(
    private elementRef: ElementRef,
    private render2: Renderer2,
    private builderEditorComponent: BuilderEditorComponent,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit(): void {
    this.element = this.elementRef.nativeElement as HTMLElement;
    this._createElement();
    // this.initDrag();
  }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }
  @HostListener('click', ['$event']) onClickElement(event: MouseEvent) {
    event.stopPropagation();
    const quickEditor = document.querySelectorAll('.builder-quick-editor')[0];
    let left = Number(this.element.style.left.replace('px', '')) || 0;
    let top = Number(this.element.style.top.replace('px', '')) || 0;
    this.builderEditorComponent.setHasSelected(true);
    this.render2.setStyle(quickEditor, 'top', top);
    this.render2.setStyle(quickEditor, 'left', left);
    this.initDrag();
    this.render2.appendChild(this.element, this.wresize);
    this.render2.appendChild(this.element, this.eresize);
    this.render2.appendChild(this.element, this.selected);
    if (this._elementSelected) {
      this.render2.appendChild(this.element, this._elementSelected);
    }
    const dragStart$ = fromEvent<MouseEvent>(
      document.querySelectorAll('.ladi-e-resize'),
      'mousedown'
    );
    const dragStartLeft$ = fromEvent<MouseEvent>(
      document.querySelectorAll('.ladi-w-resize'),
      'mousedown'
    );
    const dragEnd$ = fromEvent<MouseEvent>(this.document, 'mouseup');
    const drag$ = fromEvent<MouseEvent>(this.document, 'mousemove').pipe(
      takeUntil(dragEnd$)
    );
    const dragStartTest$ = this.eleResize.map((ele) =>
      fromEvent<MouseEvent>(
        document.querySelectorAll(`.${ele}`),
        'mousedown'
      ).pipe(map((value) => ({ ele, value })))
    );

    // resize right
    let dragSub: Subscription;
    const dragStartSub = dragStart$.subscribe((event: MouseEvent) => {
      this.clearSub();
      dragSub = drag$.subscribe((event: MouseEvent) => {
        event.preventDefault();
        const newWidth =
          event.pageX - this.element.getBoundingClientRect().left;
        this.render2.setStyle(this.element, 'width', newWidth + 'px');
      });

      dragEnd$.pipe(take(1)).subscribe(() => {
        if (dragSub) {
          dragSub.unsubscribe();
        }
        if (dragStartSub) {
          dragStartSub.unsubscribe();
        }
      });
    });
    const dragStartSubLeft = dragStartLeft$.subscribe((event: MouseEvent) => {
      this.clearSub();
      let original_width = Number(this.element.style.width.replace('px', ''));
      let original_x = this.element.getBoundingClientRect().left;
      let original_mouse_x = event.pageX;
      dragSub = drag$.subscribe((event: MouseEvent) => {
        event.preventDefault();
        const width = original_width - (event.pageX - original_mouse_x);
        const left = original_x + (event.pageX - original_mouse_x);
        this.render2.setStyle(this.element, 'width', width + 'px');
        this.render2.setStyle(this.element, 'left', left + 'px');
      });

      dragEnd$.pipe(take(1)).subscribe(() => {
        if (dragSub) {
          dragSub.unsubscribe();
        }
        if (dragStartSubLeft) {
          dragStartSubLeft.unsubscribe();
        }
      });
    });
  }

  @HostListener('dblclick', ['$event']) onDbClick(event: MouseEvent) {
    this._elementEditor = this.element.querySelectorAll(
      '.ladi-headline'
    )[0] as HTMLElement;
    this.render2.setAttribute(this._elementEditor, 'contenteditable', 'true');
  }
  @HostListener('blur', ['$event']) onBlur(event: MouseEvent) {
    console.log('blur');
  }

  @HostListener('mouseenter', ['$event']) onMouseenter(event: MouseEvent) {
    if (!this._dataId) {
      this._dataId = this.element.dataset.id;
    }
    if (!this._elementHover) {
      let elementHover = this.render2.createElement('div');
      this.render2.addClass(elementHover, 'ladi-hover');
      this.render2.setAttribute(elementHover, 'data-id', this._dataId);
      this._elementHover = elementHover;
    }
    this.render2.appendChild(this.element, this._elementHover);
  }
  @HostListener('mouseleave', ['$event']) onMouseleave(event: MouseEvent) {
    console.log('leave');
    if (this._elementHover) {
      this.render2.removeChild(this.element, this._elementHover);
    }
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (!this._elementSelected) {
        this._elementSelected = this.element.querySelectorAll(
          '.ladi-selected'
        )[0] as HTMLElement;
      }
      this.render2.removeChild(this.element, this._elementSelected);
      // this.clearSub();
      if (this.element.contains(this.wresize)) {
        this.render2.removeChild(this.element, this.wresize);
        this.render2.removeChild(this.element, this.eresize);
        this.render2.removeChild(this.element, this.selected);
      }
      if (this._elementEditor) {
        this.render2.removeAttribute(this._elementEditor, 'contenteditable');
      }
      this.builderEditorComponent.setHasSelected(false);
    }
  }
  initDrag(): void {
    // 1
    const dragStart$ = fromEvent<MouseEvent>(this.element, 'mousedown');
    const dragEnd$ = fromEvent<MouseEvent>(this.document, 'mouseup');
    const drag$ = fromEvent<MouseEvent>(this.document, 'mousemove').pipe(
      takeUntil(dragEnd$)
    );
    // 2
    let initialX: number,
      initialY: number,
      currentX = Number(this.element.style.left.replace('px', '')) || 0,
      currentY = Number(this.element.style.top.replace('px', '')) || 0;

    let dragSub: Subscription;

    // 3
    const dragStartSub = dragStart$.subscribe((event: MouseEvent) => {
      initialX = event.clientX - currentX;
      initialY = event.clientY - currentY;
      this.element.classList.add('free-dragging');
      this.render2.setStyle(this.element, 'cursor', 'move');
      // 4
      dragSub = drag$.subscribe((event: MouseEvent) => {
        event.preventDefault();

        currentX = event.clientX - initialX;
        currentY = event.clientY - initialY;
        this.render2.setStyle(this.element, 'top', currentY + 'px');
        this.render2.setStyle(this.element, 'left', currentX + 'px');
      });
    });

    // 5
    const dragEndSub = dragEnd$.subscribe(() => {
      initialX = currentX;
      initialY = currentY;
      this.element.classList.remove('free-dragging');
      this.render2.removeStyle(this.element, 'cursor');
      if (dragSub) {
        dragSub.unsubscribe();
      }
    });

    // 6
    this.subscriptions.push.apply(this.subscriptions, [
      dragStartSub,
      dragSub,
      dragEndSub,
    ]);
  }

  private _createElement() {
    let childWelement = this.render2.createElement('div');
    this.render2.addClass(childWelement, 'ladi-resize-display');
    let childWelement2 = this.render2.createElement('div');
    this.render2.addClass(childWelement2, 'ladi-resize-display');
    this.wresize = this.render2.createElement('div');
    this.wresize.classList.add('ladi-resize', 'ladi-w-resize');
    this.render2.appendChild(this.wresize, childWelement2);
    this.eresize = this.render2.createElement('div');
    this.eresize.classList.add('ladi-resize', 'ladi-e-resize');
    this.render2.appendChild(this.eresize, childWelement);
    this.selected = this.render2.createElement('div');
    this.selected.classList.add('ladi-selected', 'ladi-size');
  }

  ngOnDestroy(): void {
    this.clearSub();
  }
  clearSub() {
    this.subscriptions.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
}
