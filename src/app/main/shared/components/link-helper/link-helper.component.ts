import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-link-helper',
  templateUrl: './link-helper.component.html',
  styleUrls: ['./link-helper.component.scss'],
})
export class LinkHelperComponent implements OnChanges {
  @Input() hideType = false;
  @Input() documentId = '';
  @Input() labelTxt = '';

  docType: string = '';
  docId: string = '';
  href: string = '';
  knownType: boolean = false;
  idFound: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.documentId) {
      // so far, I think these are all coming from punch patterns. It might be better to handle this in the link-helper-cell component. For now, just ignore them.
      return;
    }
    let docIdArray = this.documentId.split('/');
    this.docType = docIdArray[0];
    if (docIdArray.length === 1) {
      console.error(`Invalid documentId:${this.documentId}`);
      this.labelTxt = 'Invalid documentId';
      return;
    }
    this.docId = docIdArray[1];
    this.idFound = Boolean(this.docId) ? !(this.docId === 'null' || this.docId === '0') : false;
    switch (this.docType) {
      case 'JobDetail':
        this.knownType = true;
        break;
      case 'Coil':
        this.knownType = true;
        break;
      case 'PunchPattern':
        this.knownType = true;
        break;
      case 'Material':
        if (this.docId === 'NO COIL MATCH') {
          this.idFound = false;
        }
        this.knownType = true;
        break;
      case 'setupsChange':
        if (docIdArray.length === 3) {
          this.knownType = true;
          this.href = `/machines/xl200/${docIdArray[1]}?tab=setups&snapshot=${docIdArray[2]}`;
        } else {
          console.error(`Invalid documentId:${this.documentId}`);
        }
        break;
      default:
        console.log(`Unknown type:${this.docType}`);
        break;
    }
  }
}
