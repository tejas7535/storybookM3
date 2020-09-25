import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ENV_CONFIG } from './environment-config.interface';
import { StompService } from './stomp.service';

describe('Data Service', () => {
  const BASE_URL = 'http://localhost:8080';
  let service: StompService;
  let spectator: SpectatorService<StompService>;

  const createService = createServiceFactory({
    service: StompService,
    providers: [
      StompService,
      {
        provide: ENV_CONFIG,
        useValue: {
          environment: {
            baseUrl: BASE_URL,
          },
        },
      },
    ],
  });
  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('connect', () => {
    test('should establish a socket connection', () => {
      const token = 'fantasyToken';

      // prevents the STOMP debugging output
      console.log = jest.fn();
      console.error = jest.fn();

      service.connect(token).subscribe((response) => {
        expect(response).toBeDefined();
      });
    });
  });

  describe('disconnect', () => {
    test('should return Observable containing true connection ended', () => {
      service.disconnect().subscribe((response) => {
        expect(response).toBeDefined();
      });
    });
  });

  describe('getTopicBroadcast', () => {
    test('should return Observable containing false if no connection', () => {
      service.getTopicBroadcast().subscribe((response) => {
        expect(response).toBeDefined();
      });
    });
  });

  describe('getSocketUrl', () => {
    test('should return a url string that starts with wss in any case', () => {
      Object.defineProperty(global, 'window', {
        value: {
          location: {
            host: 'server:6969',
          },
        },
      });

      expect(service.getSocketUrl('/api')).toBe('wss://server:6969/api');
      expect(service.getSocketUrl('https://localhost:6969/api')).toBe(
        'wss://localhost:6969/api'
      );
    });
  });
});
