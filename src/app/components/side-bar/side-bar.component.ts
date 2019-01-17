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
  exportHappinessScoreData: any;
  exportCommentsOptions: any;
  exportScoreOptions: any;
  currentInfoUser: any;
  projectInfo: any;

  // Constructor
  constructor(private dragula: DragulaService, private afs: AngularFirestore, private router: Router) {
    this.exportData = [];
    this.exportHappinessScoreData = [];
    this.exportCommentsOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: false,
      headers: ["Type", "Description", "Votes"]
    };

    this.exportScoreOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: false,
      headers: ["Name", "Description", "Score"]
    };

    this.currentInfoUser = JSON.parse(sessionStorage.getItem('currentUserInfo'));
    this.projectInfo = JSON.parse(sessionStorage.getItem('projectInfo'));
  }

  // Download data - Comments list
  downloadCommentsList() {
    const _this = this;
    this.exportData = [];
    // Add firestore listerner to watch the collection
    let meetingIdPath = this.afs.firestore.collection("meetingInfo").doc(this.currentInfoUser.meetingId);
    meetingIdPath.collection('comments')
      .get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const data = doc.data();
          let _tempObj = {};
          if (_this.projectInfo.retroTheme.id === 0) {
            _tempObj = { type: data.category.value, description: data.description, likes: data.likes };
            (_this.exportData[data['category']['name']]) ? _this.exportData[data['category']['name']] : _this.exportData[data['category']['name']] = [];
            _this.exportData[data['category']['name']].push(_tempObj);
          } else if (_this.projectInfo.retroTheme.id === 1) {
            _tempObj = { title: data.title, description: data.description, likes: data.likes };
            _this.exportData.push(_tempObj);
          }
        });
        setTimeout(function () {
          // Assign values to export plugin
          let formattedExportData = [];
          if (_this.projectInfo.retroTheme.id === 0) {
            formattedExportData = _.unionBy(_this.exportData.wentWellList, _this.exportData.wentWrongList, _this.exportData.needToImproveList);
          } else if (_this.projectInfo.retroTheme.id === 1) {
            formattedExportData = _this.exportData;
          }
          new Angular5Csv(formattedExportData, 'Retrospective', _this.exportCommentsOptions);
        }, 100);
      });
  }

  // Download happiness score
  downloadHappinessScore() {
    const _this = this;
    this.exportHappinessScoreData = [];
    // Add firestore listerner to watch the collection
    let meetingIdPath = this.afs.firestore.collection("meetingInfo").doc(this.currentInfoUser.meetingId);
    meetingIdPath.collection('userList')
      .get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const data = doc.data();
          if (data.happinessScore) {
            let _tempObj = {};
            _tempObj = { name: data.happinessScore.name, description: data.happinessScore.feelDescription, vote: data.happinessScore.score };
            _this.exportHappinessScoreData.push(_tempObj);
          }
        });
        setTimeout(function () {
          // Assign values to export plugin
          new Angular5Csv(_this.exportHappinessScoreData, 'Happiness score', _this.exportScoreOptions);
        }, 100);
      });
  }

  ngOnInit() {
  }

}
