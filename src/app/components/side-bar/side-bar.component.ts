import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import * as _ from "lodash";
import { DragulaService } from 'ng2-dragula/ng2-dragula';
// To improve 
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  // New variables
  exportData: any;
  exportOptions: any;

  // Constructor
  constructor(private dragula: DragulaService, private afs: AngularFirestore, private router: Router) {
    this.exportData = [];
    this.exportOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: false,
      headers: ["Type", "Description", "Votes"]
    };

    this.getCommentList();
  }

  // Download data 
  downloadExcelFile() {
    const formattedExportData = _.unionBy(this.exportData.wentWellList, this.exportData.wentWrongList, this.exportData.needToImproveList);
    new Angular5Csv(formattedExportData, 'Retrospective', this.exportOptions);
  }

  getCommentList() {
    const _this = this;
    // Add firestore listerner to watch the collection
    this.afs.firestore.collection('comments')
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const data = doc.data();
          let _tempObj = {};
          _tempObj = { type: data.category.value, description: data.description, likes: data.likes };
          (_this.exportData[data['category']['name']]) ? _this.exportData[data['category']['name']] : _this.exportData[data['category']['name']] = [];
          _this.exportData[data['category']['name']].push(_tempObj);
        });
      });
  }
  ngOnInit() {
  }

}
