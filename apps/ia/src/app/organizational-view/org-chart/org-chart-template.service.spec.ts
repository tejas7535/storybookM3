import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { OrgChartNode } from './models';
import { OrgChartTemplateService } from './org-chart-template.service';

describe('OrgChartTemplateService', () => {
  const HIGHLIGHT_COLOR = 'rgba(0, 0, 0, 0.87)';
  let service: OrgChartTemplateService;
  let spectator: SpectatorService<OrgChartTemplateService>;

  const createService = createServiceFactory({
    service: OrgChartTemplateService,
    providers: [OrgChartTemplateService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('getGeneralNodeContent', () => {
    test('should get general node content', () => {
      const data = {
        nodeId: 'abc',
        organization: 'XYZ',
        showUpperParentBtn: false,
      } as OrgChartNode;

      service.getParrentArrow = jest.fn().mockReturnValue('getParrentArrow');
      service.getParentNodeId = jest.fn().mockReturnValue('getParentNodeId');
      service.getFluctuationNodeId = jest
        .fn()
        .mockReturnValue('getFluctuationNodeId');
      service.getPeopleIconSvg = jest.fn().mockReturnValue('getPeopleIconSvg');
      service.getFluctuationIconSvg = jest
        .fn()
        .mockReturnValue('getFluctuationIconSvg');
      service.getRectBorderStyles = jest
        .fn()
        .mockReturnValue('getRectBorderStyles');
      service.getHeaderBorderStyles = jest
        .fn()
        .mockReturnValue('getHeaderBorderStyles');
      service.getHeaderClass = jest.fn().mockReturnValue('getHeaderClass');

      const result = service.getGeneralNodeContent(data, 200, 100, 'red');

      expect(result).toContain('XYZ');
      expect(result).toContain('height: 100px');
      expect(result).toContain('width: 200px');
      expect(result).not.toContain('org-chart-tooltip');
      expect(result).toContain('getParentNodeId');
      expect(result).toContain('getFluctuationNodeId');
      expect(result).toContain('getPeopleIconSvg');
      expect(result).toContain('getFluctuationIconSvg');
      expect(result).toContain('getRectBorderStyles');
      expect(result).toContain('getHeaderBorderStyles');
      expect(result).toContain('getHeaderClass');
      expect(service.getParrentArrow).not.toHaveBeenCalled();
      expect(service.getParentNodeId).toHaveBeenCalledWith(data);
      expect(service.getFluctuationNodeId).toHaveBeenCalledWith(data);
      expect(service.getPeopleIconSvg).toHaveBeenCalledWith('getParentNodeId');
      expect(service.getFluctuationIconSvg).toHaveBeenCalledWith(
        'getFluctuationNodeId'
      );
      expect(service.getRectBorderStyles).toHaveBeenCalledWith(data, 'red');
      expect(service.getHeaderBorderStyles).toHaveBeenCalledWith(data, 'red');
      expect(service.getHeaderClass).toHaveBeenCalledWith(data);
    });
  });

  describe('getOrgUnitNodeContent', () => {
    test('should get org unit node content', () => {
      const data = {
        nodeId: 'abc',
        name: 'XYZ',
        showUpperParentBtn: true,
      } as OrgChartNode;

      service.getParrentArrow = jest.fn().mockReturnValue('getParrentArrow');
      service.getParentNodeId = jest.fn().mockReturnValue('getParentNodeId');
      service.getFluctuationNodeId = jest
        .fn()
        .mockReturnValue('getFluctuationNodeId');
      service.getPeopleIconSvg = jest.fn().mockReturnValue('getPeopleIconSvg');
      service.getFluctuationIconSvg = jest
        .fn()
        .mockReturnValue('getFluctuationIconSvg');
      service.getRectBorderStyles = jest
        .fn()
        .mockReturnValue('getRectBorderStyles');
      service.getHeaderBorderStyles = jest
        .fn()
        .mockReturnValue('getHeaderBorderStyles');
      service.getHeaderClass = jest.fn().mockReturnValue('getHeaderClass');

      const result = service.getOrgUnitNodeContent(data, 200, 100, 'red');

      expect(result).toContain('XYZ');
      expect(result).toContain('height: 100px');
      expect(result).toContain('width: 200px');
      expect(result).toContain('org-chart-tooltip');
      expect(result).toContain('getParentNodeId');
      expect(result).toContain('getFluctuationNodeId');
      expect(result).toContain('getPeopleIconSvg');
      expect(result).toContain('getFluctuationIconSvg');
      expect(result).toContain('getRectBorderStyles');
      expect(result).toContain('getHeaderBorderStyles');
      expect(result).toContain('getHeaderClass');
      expect(service.getParrentArrow).toHaveBeenCalledWith(data, 180);
      expect(service.getParentNodeId).toHaveBeenCalledWith(data);
      expect(service.getFluctuationNodeId).toHaveBeenCalledWith(data);
      expect(service.getPeopleIconSvg).toHaveBeenCalledWith('getParentNodeId');
      expect(service.getFluctuationIconSvg).toHaveBeenCalledWith(
        'getFluctuationNodeId'
      );
      expect(service.getRectBorderStyles).toHaveBeenCalledWith(data, 'red');
      expect(service.getHeaderBorderStyles).toHaveBeenCalledWith(data, 'red');
      expect(service.getHeaderClass).toHaveBeenCalledWith(data);
    });
  });

  describe('getButtonContent', () => {
    test('should get button content when node has children', () => {
      const data = {
        children: [{}, {}],
        data: { nodeId: 'abc', _directSubordinates: 9_977_790 },
      } as any;

      const result = service.getButtonContent(data);

      expect(result).toContain('id="org-chart-node-collapse" data-id="abc"');
      expect(result).toContain('9977790');
      expect(result).toContain(`before:content-['\\e313']`);
    });

    test('should get button content when node has no children', () => {
      const data = {
        data: { nodeId: 'abc', _directSubordinates: 9_977_790 },
      } as any;

      const result = service.getButtonContent(data);

      expect(result).toContain('id="org-chart-node-expand" data-id="abc"');
      expect(result).toContain('9977790');
      expect(result).toContain(`before:content-['\\e316']`);
    });
  });

  describe('getParrentArrow', () => {
    test('should get parent arrow', () => {
      const data = { nodeId: 'abc' } as OrgChartNode;

      const result = service.getParrentArrow(data, 200);

      expect(result).toContain('bottom: 200px;');
      expect(result).toContain('id="org-chart-node-show-parent" data-id="abc"');
      expect(result).toContain(
        'd="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"'
      );
    });
  });

  describe('getHeaderClass', () => {
    test('should get highlighted class when node is highlighted up to the root', () => {
      const data = { nodeId: 'abc' } as OrgChartNode;

      const result = service.getHeaderClass(data);

      expect(result).toEqual('org-chart-header-abc');
    });
  });

  describe('getFluctuationNodeId', () => {
    test('should get fluctuation node id', () => {
      const data = { nodeId: 'abc' } as OrgChartNode;

      const result = service.getFluctuationNodeId(data);

      expect(result).toEqual('id="org-chart-node-attrition" data-id="abc"');
    });
  });

  describe('getParentNodeId', () => {
    test('should get parent node id', () => {
      const data = { nodeId: 'abc' } as OrgChartNode;

      const result = service.getParentNodeId(data);

      expect(result).toEqual('id="org-chart-node-people" data-id="abc"');
    });
  });

  describe('getRectBorderStyles', () => {
    test('should get highlighted border when node is highlighted up to the root', () => {
      const data = { _upToTheRootHighlighted: true } as OrgChartNode;

      const result = service.getRectBorderStyles(data, HIGHLIGHT_COLOR);

      expect(result).toEqual(`border: 2px solid ${HIGHLIGHT_COLOR}`);
    });

    test('should get highlighted border when single node is highlighted', () => {
      const data = { _highlighted: true } as OrgChartNode;

      const result = service.getRectBorderStyles(data, HIGHLIGHT_COLOR);

      expect(result).toEqual(`border: 2px solid ${HIGHLIGHT_COLOR}`);
    });

    test('should get normal border when node is not highlighted', () => {
      const data = { _upToTheRootHighlighted: false } as OrgChartNode;

      const result = service.getRectBorderStyles(data, HIGHLIGHT_COLOR);

      expect(result).toEqual(`border: 1px solid rgba(0, 0, 0, 0.32)`);
    });
  });

  describe('getHeaderBorderStyles', () => {
    test('should get highlighted border when node is highlighted up to the root', () => {
      const data = { _upToTheRootHighlighted: true } as OrgChartNode;

      const result = service.getHeaderBorderStyles(data, HIGHLIGHT_COLOR);

      expect(result).toEqual(`border: 1px solid ${HIGHLIGHT_COLOR}`);
    });

    test('should get highlighted border when single node is highlighted', () => {
      const data = { _highlighted: true } as OrgChartNode;

      const result = service.getHeaderBorderStyles(data, HIGHLIGHT_COLOR);

      expect(result).toEqual(`border: 1px solid ${HIGHLIGHT_COLOR}`);
    });

    test('should unset border when node is not highlighted', () => {
      const data = { _upToTheRootHighlighted: false } as OrgChartNode;

      const result = service.getHeaderBorderStyles(data, HIGHLIGHT_COLOR);

      expect(result).toEqual(`border: none`);
    });
  });

  describe('getPeopleIconSvg', () => {
    test('should get people icon svg', () => {
      const nodeId = 'people-icon';

      const result = service.getPeopleIconSvg(nodeId);

      expect(result).toContain(
        `d="M7.82663 5.33331C7.82663 6.43998 6.93996 7.33331 5.83329 7.33331C4.72663 7.33331 3.83329 6.43998 3.83329 5.33331C3.83329 4.22665 4.72663 3.33331 5.83329 3.33331C6.93996 3.33331 7.82663 4.22665 7.82663 5.33331ZM13.16 5.33331C13.16 6.43998 12.2733 7.33331 11.1666 7.33331C10.06 7.33331 9.16663 6.43998 9.16663 5.33331C9.16663 4.22665 10.06 3.33331 11.1666 3.33331C12.2733 3.33331 13.16 4.22665 13.16 5.33331ZM5.83329 8.66665C4.27996 8.66665 1.16663 9.44665 1.16663 11V12.6666H10.5V11C10.5 9.44665 7.38663 8.66665 5.83329 8.66665ZM10.52 8.69998C10.7533 8.67998 10.9733 8.66665 11.1666 8.66665C12.72 8.66665 15.8333 9.44665 15.8333 11V12.6666H11.8333V11C11.8333 10.0133 11.2933 9.25998 10.52 8.69998Z"`
      );
      expect(result).toContain(nodeId);
      expect(result).toContain('group-hover:fill-primary');
    });
  });

  describe('getFluctuationIconSvg', () => {
    test('should get fluctuation icon svg', () => {
      const nodeId = 'fluctuation-icon';

      const result = service.getFluctuationIconSvg(nodeId);

      expect(result).toContain(
        `d="M3.33333 2H12.6667C13.4 2 14 2.6 14 3.33333V12.6667C14 13.4 13.4 14 12.6667 14H3.33333C2.6 14 2 13.4 2 12.6667V3.33333C2 2.6 2.6 2 3.33333 2ZM4.66667 11.3333H6V6.66667H4.66667V11.3333ZM8.66667 11.3333H7.33333V4.66667H8.66667V11.3333ZM10 11.3333H11.3333V8.66667H10V11.3333Z"`
      );
      expect(result).toContain(nodeId);
      expect(result).toContain('group-hover:fill-primary');
    });
  });
});
