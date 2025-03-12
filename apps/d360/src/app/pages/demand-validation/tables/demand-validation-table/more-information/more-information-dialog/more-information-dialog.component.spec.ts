import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { MoreInformationDialogComponent } from './more-information-dialog.component';

describe('MoreInformationDialogComponent', () => {
  let spectator: Spectator<MoreInformationDialogComponent>;
  const createHost = createComponentFactory({
    component: MoreInformationDialogComponent,
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          /* Provide mock data for MaterialListEntry */
        },
      },
    ],
  });

  beforeEach(() => (spectator = createHost()));

  it('should create an instance', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('map', () => {
    it('should return the correct value for currentRLTSchaeffler', () => {
      // Arrange
      const key = 'currentRLTSchaeffler';
      spectator.component['material'][key] = 'testValue';
      spectator.component['material'][
        'transitTimeBetweenProdPlantAndDistributionPlant'
      ] = 2;

      // Act
      const result = spectator.component['map'](key);

      // Assert
      expect(result.value).toEqual('testValue (2)');
    });

    it('should return the correct value for demandCharacteristic', () => {
      // Arrange
      const key = 'demandCharacteristic';
      spectator.component['material'][key] = 'someDemandCharacteristic';

      // Act
      const result = spectator.component['map'](key);

      // Assert
      expect(result.value).toEqual(
        'validation_of_demand.more_information.dialog.demandCharacteristics.someDemandCharacteristic'
      );
    });

    it('should return the correct value for sectorManagement', () => {
      // Arrange
      const key = 'sectorManagement';
      spectator.component['material'][key] = 'testSectorManagement';
      spectator.component['material']['sectorManagementText'] =
        'testSectorManagementText';

      // Act
      const result = spectator.component['map'](key);

      // Assert
      expect(result.value).toEqual(
        'testSectorManagement - testSectorManagementText'
      );
    });
  });
});
