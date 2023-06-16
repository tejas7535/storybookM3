import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { RoutePath } from '../../../app-routing.enum';
import {
  aqmCalculatorLearnMoreData,
  insulationSolutionsLearnMoreData,
  materialSupplierDbLearnMoreData,
} from '../config';
import { hardnessConverterLearnMoreData } from '../config/hardness-converter';
import { LearnMoreResolver } from './learn-more.resolver';

describe('LearnMoreResolverResolver', () => {
  let spectator: SpectatorService<LearnMoreResolver>;
  let resolver: LearnMoreResolver;

  const mockBaseRoute: ActivatedRouteSnapshot = {
    paramMap: {
      get: jest.fn(),
    },
  } as unknown as ActivatedRouteSnapshot;

  const mockRouterState: RouterStateSnapshot =
    {} as unknown as RouterStateSnapshot;

  const createService = createServiceFactory({
    service: LearnMoreResolver,
    imports: [RouterTestingModule],
    providers: [],
  });

  beforeEach(() => {
    spectator = createService();
    resolver = spectator.inject(LearnMoreResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve hardness converter', () => {
    mockBaseRoute.paramMap.get = jest
      .fn()
      .mockReturnValue(RoutePath.HardnessConverterPath);
    const ret = resolver.resolve(mockBaseRoute, mockRouterState);
    expect(ret).toBe(hardnessConverterLearnMoreData);
  });

  it('should resolve MSD', () => {
    mockBaseRoute.paramMap.get = jest
      .fn()
      .mockReturnValue(RoutePath.MaterialsSupplierDatabasePath);
    const ret = resolver.resolve(mockBaseRoute, mockRouterState);
    expect(ret).toBe(materialSupplierDbLearnMoreData);
  });

  it('should resolve AQM', () => {
    mockBaseRoute.paramMap.get = jest
      .fn()
      .mockReturnValue(RoutePath.AQMCalculatorPath);
    const ret = resolver.resolve(mockBaseRoute, mockRouterState);
    expect(ret).toBe(aqmCalculatorLearnMoreData);
  });

  it('should resolve Insulation Solutions', () => {
    mockBaseRoute.paramMap.get = jest
      .fn()
      .mockReturnValue(RoutePath.InsulationSolutionsPath);
    const ret = resolver.resolve(mockBaseRoute, mockRouterState);
    expect(ret).toBe(insulationSolutionsLearnMoreData);
  });

  it('should resolve other routes', () => {
    resolver['router'].navigate = jest.fn();
    mockBaseRoute.paramMap.get = jest.fn().mockReturnValue('/some/other/route');
    const ret = resolver.resolve(mockBaseRoute, mockRouterState);
    expect(ret).toBeUndefined();
    expect(resolver['router'].navigate).toHaveBeenCalled();
  });
});
