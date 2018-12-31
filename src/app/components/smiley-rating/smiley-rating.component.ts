import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'smiley-rating',
  templateUrl: './smiley-rating.component.html',
  styleUrls: ['./smiley-rating.component.css']
})
export class SmileyRatingComponent implements OnInit {
  noOfSmileys: any;
  currentUserRating: number;
  @Input() userHappinessScore: number;

  constructor() {
    this.noOfSmileys = [
      {
        type: 'Very sad',
        score: 1,
        className: 'very-sad',
        labelText: 'Very sad'
      }, {
        smileyType: 'Sad',
        score: 2, className: 'sad',
        labelText: 'Sad'
      }, {
        smileyType: 'Neutral',
        score: 3, className: 'neutral',
        labelText: 'Ok'
      }, {
        smileyType: 'Happy',
        score: 4, className: 'happy',
        labelText: 'Happy'
      }, {
        smileyType: 'Very happy',
        score: 5, className: 'very-happy',
        labelText: 'Very happy'
      }
    ];
  }

  ngOnInit() {
    console.log(this.userHappinessScore);
  }

}
