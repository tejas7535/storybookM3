import { CollectionViewer, ListRange } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BehaviorSubject, of, throwError } from 'rxjs';

import { SalesPlanningService } from '../../../../feature/sales-planning/sales-planning.service';
import { BackendTableResponse } from '../../../../shared/components/table';
import { Comment } from '../../../../shared/models/comments.model';
import { Stub } from '../../../../shared/test/stub.class';
import { CommentsDataSourceService } from './comments-datasource.service';

describe('CommentsDataSourceService', () => {
  let service: CommentsDataSourceService;
  let salesPlanningServiceStub: jest.Mocked<SalesPlanningService>;
  let collectionViewerStub: CollectionViewer;
  let viewChangeSubject: BehaviorSubject<ListRange>;

  const mockComments: Comment[] = [
    {
      id: '1',
      text: 'Comment 1',
      createdAt: new Date(),
      createdByUserName: 'User 1',
      createdByUserId: 'user1-id',
    },
    {
      id: '2',
      text: 'Comment 2',
      createdAt: new Date(),
      createdByUserName: 'User 2',
      createdByUserId: 'user2-id',
    },
  ];

  const mockBackendResponse: BackendTableResponse<Comment> = {
    rows: mockComments,
    rowCount: 2,
    lastRow: 2,
  };

  beforeEach(() => {
    viewChangeSubject = new BehaviorSubject<ListRange>({ start: 0, end: 50 });

    collectionViewerStub = {
      viewChange: viewChangeSubject.asObservable(),
    } as CollectionViewer;

    service = Stub.get<CommentsDataSourceService>({
      component: CommentsDataSourceService,
      providers: [
        Stub.getSalesPlanningServiceProvider(),
        { provide: MAT_DIALOG_DATA, useValue: { customerNumber: '12345' } },
      ],
    });

    salesPlanningServiceStub = service[
      'salesPlanningService'
    ] as jest.Mocked<SalesPlanningService>;
    salesPlanningServiceStub.getComments$ = jest
      .fn()
      .mockReturnValue(of(mockBackendResponse));
  });

  describe('connect', () => {
    it('should fetch the first page on connect', () => {
      service.connect(collectionViewerStub);

      expect(salesPlanningServiceStub.getComments$).toHaveBeenCalledWith({
        startRow: 0,
        endRow: 50,
        sortModel: [{ colId: 'createdAt', sort: 'asc' }],
        selectionFilters: { customerNumber: ['12345'] },
      });
    });

    it('should update length and data when first page is fetched', () => {
      service.connect(collectionViewerStub);

      expect(service.length).toBe(2);
      expect(service.allData.length).toBe(2);
      expect(service.allData[0]).toEqual(mockComments[0]);
      expect(service.allData[1]).toEqual(mockComments[1]);
    });

    it('should fetch first page when length is zero', () => {
      // Set up a specific case where we have no data yet
      service.length = 0;

      service.connect(collectionViewerStub);

      // First page should be fetched automatically on connect
      expect(salesPlanningServiceStub.getComments$).toHaveBeenCalledWith({
        startRow: 0,
        endRow: 50,
        sortModel: [{ colId: 'createdAt', sort: 'asc' }],
        selectionFilters: { customerNumber: ['12345'] },
      });
    });

    it('should subscribe to viewChange and fetch corresponding pages', () => {
      service.connect(collectionViewerStub);

      // Reset the mock to clear the initial call
      salesPlanningServiceStub.getComments$.mockClear();

      // Simulate scrolling to another page
      viewChangeSubject.next({ start: 50, end: 100 });

      expect(salesPlanningServiceStub.getComments$).toHaveBeenCalledWith({
        startRow: 50,
        endRow: 100,
        sortModel: [{ colId: 'createdAt', sort: 'asc' }],
        selectionFilters: { customerNumber: ['12345'] },
      });
    });

    it('should not fetch the same page twice', () => {
      service.connect(collectionViewerStub);

      // Clear the initial call
      salesPlanningServiceStub.getComments$.mockClear();

      // Try fetching the first page again
      viewChangeSubject.next({ start: 0, end: 50 });

      expect(salesPlanningServiceStub.getComments$).not.toHaveBeenCalled();
    });

    it('should update loaded$ and secondLoadNeeded$ state correctly when result has more than one page', () => {
      const largeResponse = {
        rows: mockComments,
        rowCount: 75, // More than the page size (50)
        lastRow: 2,
      };
      salesPlanningServiceStub.getComments$ = jest
        .fn()
        .mockReturnValue(of(largeResponse));

      service.connect(collectionViewerStub);

      expect(service.loaded$.getValue()).toBe(false);
      expect(service.secondLoadNeeded$.getValue()).toBe(true);

      // Simulate loading the second page
      salesPlanningServiceStub.getComments$.mockClear();
      salesPlanningServiceStub.getComments$ = jest.fn().mockReturnValue(
        of({
          rows: mockComments,
          rowCount: 75,
          lastRow: 4,
        })
      );

      viewChangeSubject.next({ start: 50, end: 75 });

      expect(service.loaded$.getValue()).toBe(true);
      expect(service.secondLoaded$.getValue()).toBe(true);
      expect(service.secondLoadNeeded$.getValue()).toBe(null);
    });

    it('should update loaded$ state correctly when result fits in a single page', () => {
      salesPlanningServiceStub.getComments$ = jest
        .fn()
        .mockReturnValue(of(mockBackendResponse));

      service.connect(collectionViewerStub);

      expect(service.loaded$.getValue()).toBe(true);
      expect(service.secondLoadNeeded$.getValue()).toBe(false);
    });

    it('should handle errors when fetching data', () => {
      salesPlanningServiceStub.getComments$ = jest
        .fn()
        .mockReturnValue(throwError(() => new Error('Network error')));

      service.connect(collectionViewerStub);

      // The service should not crash and the page should not be marked as fetched
      expect(service.length).toBe(0);

      // After an error, a retry should be possible
      salesPlanningServiceStub.getComments$ = jest
        .fn()
        .mockReturnValue(of(mockBackendResponse));
      viewChangeSubject.next({ start: 0, end: 50 });

      expect(salesPlanningServiceStub.getComments$).toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    it('should unsubscribe from all subscriptions', () => {
      const subscriptionSpy = jest.spyOn(
        service['subscription'],
        'unsubscribe'
      );

      service.connect(collectionViewerStub);
      service.disconnect();

      expect(subscriptionSpy).toHaveBeenCalled();
    });
  });

  describe('refreshLastPage', () => {
    it('should update length and fetch the last page again', () => {
      // First connect to initialize
      service.connect(collectionViewerStub);
      salesPlanningServiceStub.getComments$.mockClear();

      // Refresh with a new length
      service.refreshLastPage(3);

      expect(service.length).toBe(3);

      // Should fetch the last page
      expect(salesPlanningServiceStub.getComments$).toHaveBeenCalledWith({
        startRow: 0, // Because 3 items still fit in page 0 (with page size 50)
        endRow: 50,
        sortModel: [{ colId: 'createdAt', sort: 'asc' }],
        selectionFilters: { customerNumber: ['12345'] },
      });
    });

    it('should fetch the correct last page for larger datasets', () => {
      // First connect to initialize
      service.connect(collectionViewerStub);

      // Set a larger length
      service.length = 75;
      salesPlanningServiceStub.getComments$.mockClear();

      // Refresh with a new length
      service.refreshLastPage(100);

      expect(service.length).toBe(100);

      // Should fetch the last page (in this case, page 1 covers indices 50-99)
      expect(salesPlanningServiceStub.getComments$).toHaveBeenCalledWith({
        startRow: 50,
        endRow: 100,
        sortModel: [{ colId: 'createdAt', sort: 'asc' }],
        selectionFilters: { customerNumber: ['12345'] },
      });
    });

    it('should correctly handle refreshLastPage for zero length', () => {
      // First connect to initialize but with zero items
      salesPlanningServiceStub.getComments$ = jest.fn().mockReturnValue(
        of({
          rows: [],
          rowCount: 0,
          lastRow: 0,
        })
      );

      service.connect(collectionViewerStub);
      expect(service.length).toBe(0);

      salesPlanningServiceStub.getComments$.mockClear();

      // Refresh with a new length of 1
      service.refreshLastPage(1);

      expect(service.length).toBe(1);
      expect(salesPlanningServiceStub.getComments$).toHaveBeenCalledWith({
        startRow: 0,
        endRow: 50,
        sortModel: [{ colId: 'createdAt', sort: 'asc' }],
        selectionFilters: { customerNumber: ['12345'] },
      });
    });
  });

  describe('private method behavior', () => {
    it('should calculate correct page for index', () => {
      // Test the private method indirectly by observing its effect
      service.connect(collectionViewerStub);
      salesPlanningServiceStub.getComments$.mockClear();

      // Page 0: indices 0-49
      viewChangeSubject.next({ start: 0, end: 1 });
      expect(salesPlanningServiceStub.getComments$).not.toHaveBeenCalled(); // Already fetched

      // Page 1: indices 50-99
      viewChangeSubject.next({ start: 50, end: 51 });
      expect(salesPlanningServiceStub.getComments$).toHaveBeenCalledWith(
        expect.objectContaining({
          startRow: 50,
          endRow: 100,
        })
      );

      // Page 2: indices 100-149
      salesPlanningServiceStub.getComments$.mockClear();
      viewChangeSubject.next({ start: 100, end: 101 });
      expect(salesPlanningServiceStub.getComments$).toHaveBeenCalledWith(
        expect.objectContaining({
          startRow: 100,
          endRow: 150,
        })
      );
    });

    it('should properly handle fetchPage for edge cases', () => {
      // Initialize the service
      service.connect(collectionViewerStub);
      salesPlanningServiceStub.getComments$.mockClear();

      // Fetch a very high page number to test edge case
      viewChangeSubject.next({ start: 1000, end: 1050 });

      expect(salesPlanningServiceStub.getComments$).toHaveBeenCalledWith({
        startRow: 1000,
        endRow: 1050,
        sortModel: [{ colId: 'createdAt', sort: 'asc' }],
        selectionFilters: { customerNumber: ['12345'] },
      });
    });
  });

  describe('stream behavior', () => {
    it('should properly emit data to stream$', () => {
      let emittedData: (Comment | undefined)[] = [];

      // Subscribe to the stream
      const subscription = service
        .connect(collectionViewerStub)
        .subscribe((data) => {
          emittedData = data;
        });

      expect(emittedData.length).toBe(2);
      expect(emittedData[0]).toEqual(mockComments[0]);
      expect(emittedData[1]).toEqual(mockComments[1]);

      // Clean up subscription
      subscription.unsubscribe();
    });
  });

  describe('scrollingNeeded$ behavior', () => {
    it('should emit true on scrollingNeeded$ when refreshLastPage is called', () => {
      // Initialize the service
      service.connect(collectionViewerStub);

      // Spy on the scrollingNeeded$ next method
      const scrollingNeededSpy = jest.spyOn(service.scrollingNeeded$, 'next');

      // Call refreshLastPage
      service.refreshLastPage(3);

      // Verify scrollingNeeded$ emits true
      expect(scrollingNeededSpy).toHaveBeenCalledWith(true);
    });

    it('should not emit on scrollingNeeded$ during normal page fetching', () => {
      // Initialize the service
      service.connect(collectionViewerStub);

      // Spy on the scrollingNeeded$ next method and reset call history
      const scrollingNeededSpy = jest
        .spyOn(service.scrollingNeeded$, 'next')
        .mockClear();

      // Trigger a normal page fetch
      viewChangeSubject.next({ start: 50, end: 100 });

      // Verify scrollingNeeded$ was not called
      expect(scrollingNeededSpy).not.toHaveBeenCalled();
    });

    it('should allow subscribers to react to scrollingNeeded$ emissions', () => {
      // Initialize the service
      service.connect(collectionViewerStub);

      // Create a mock subscriber
      const mockSubscriberFn = jest.fn();
      const subscription = service.scrollingNeeded$.subscribe(mockSubscriberFn);

      // Reset mock to clear the initial value
      mockSubscriberFn.mockReset();

      // Call refreshLastPage which should trigger scrollingNeeded$
      service.refreshLastPage(3);

      // Verify the subscriber was called with true
      expect(mockSubscriberFn).toHaveBeenCalledWith(true);

      // Clean up
      subscription.unsubscribe();
    });
  });
});
