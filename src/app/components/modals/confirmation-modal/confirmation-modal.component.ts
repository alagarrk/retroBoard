import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {
  public onClose: Subject<boolean>;
  constructor(private _bsModalRef: BsModalRef) { }

  // Close modal popup
  public hideModal(): void {
    this.onClose.next(false);
    this._bsModalRef.hide();
  }

   // Close modal popup
   public confirmAction(): void {
    this.onClose.next(true);
    this._bsModalRef.hide();
  }

  // Init method - onload
  public ngOnInit(): void {
    const _this = this;
    this.onClose = new Subject();
  }

}
