import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';

import { LegalComponent } from './legal.component';

describe('LegalComponent', () => {
  let component: LegalComponent;
  let fixture: ComponentFixture<LegalComponent>;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LegalComponent],
      imports: [RouterTestingModule, BreadcrumbsModule, MatIconTestingModule],
      providers: [
        {
          provide: MATERIAL_SANITY_CHECKS,
          useValue: false,
        },
      ],
    }).compileComponents();
    location = TestBed.inject(Location);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should go back in history when call the back function', () => {
    const backSpy = jest.spyOn(location, 'back');
    component.back(new MouseEvent(''));
    expect(backSpy).toBeCalled();
  });
});
