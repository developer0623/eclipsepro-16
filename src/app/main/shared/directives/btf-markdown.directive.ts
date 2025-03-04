import {
  NgModule,
  Directive,
  Input,
  ElementRef,
  Renderer2,
  OnInit,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as showdown from 'showdown';

@Directive({
  selector: '[btfMarkdown]',
})
export class BtfMarkdownDirective implements OnInit {
  @Input('btfMarkdown') content: string;

  constructor(
    private sanitizer: DomSanitizer,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    let html = this.content ? this.convertToHtml(this.content) : '';
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', html);
  }

  private convertToHtml(markdown: string): SafeHtml {
    let converter = new showdown.Converter();
    let sanitizedHtml = this.sanitizer.sanitize(SecurityContext.HTML, converter.makeHtml(markdown));
    return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml);
  }
}
