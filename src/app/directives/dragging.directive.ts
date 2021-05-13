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
import { fromEvent, merge, Subscription } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

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
  constructor(
    private elementRef: ElementRef,
    private render2: Renderer2,
    @Inject(DOCUMENT) private document: any
  ) {}
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    event.stopPropagation();
    if (this.elementRef.nativeElement.contains(event.target)) {
      this.initDrag();
      this.render2.appendChild(this.element, this.wresize);
      this.render2.appendChild(this.element, this.eresize);
      this.render2.appendChild(this.element, this.selected);
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
      // resize left
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
    } else {
      // this.clearSub();
      if (this.element.contains(this.wresize)) {
        this.render2.removeChild(this.element, this.wresize);
        this.render2.removeChild(this.element, this.eresize);
        this.render2.removeChild(this.element, this.selected);
      }
    }
  }
  ngOnInit(): void {
    this.element = this.elementRef.nativeElement as HTMLElement;
    this._createElement();
    // this.initDrag();
  }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }
  initDrag(): void {
    // 1
    const dragStart$ = fromEvent<MouseEvent>(this.element, 'mousedown');
    const dragEnd$ = fromEvent<MouseEvent>(this.document, 'mouseup');
    const drag$ = fromEvent<MouseEvent>(this.document, 'mousemove').pipe(
      takeUntil(dragEnd$)
    );
    console.log(this.element.style.top);
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
