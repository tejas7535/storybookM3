import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from '../core/http/data.service';
import { IotThing } from '../core/store/reducers/models/iot-thing.model';

@Component({
  selector: 'goldwind-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  thingID = 123;

  thing$: Observable<IotThing>;

  public constructor(private readonly dataService: DataService) {}

  ngOnInit(): void {
    this.getIotThing(this.thingID);
  }

  public getIotThing(thingID: number): void {
    this.thing$ = this.dataService.getIotThings<IotThing>(`${thingID}`);
  }
}
