import { ApprovalEventType, ApprovalWorkflowEvent } from '@gq/shared/models';

import { FilterStartReleaseEventsPipe } from './filter-start-release-events.pipe';

describe('FilterStartReleaseEventsPipe', () => {
  const pipe = new FilterStartReleaseEventsPipe();

  test('should return ampty list when undefined', () => {
    expect(pipe.transform(undefined as ApprovalWorkflowEvent[])).toStrictEqual(
      []
    );
  });
  test('should return the complete list', () => {
    const input: ApprovalWorkflowEvent[] = [
      { event: ApprovalEventType.APPROVED } as ApprovalWorkflowEvent,
      { event: ApprovalEventType.FORWARDED } as ApprovalWorkflowEvent,
      { event: ApprovalEventType.PRE_APPROVED } as ApprovalWorkflowEvent,
      { event: ApprovalEventType.REJECTED } as ApprovalWorkflowEvent,
      { event: ApprovalEventType.CANCELLED } as ApprovalWorkflowEvent,
      { event: ApprovalEventType.AUTO_APPROVAL } as ApprovalWorkflowEvent,
    ];
    const result = pipe.transform(input);
    expect(result).toStrictEqual(input);
  });

  test('should return dismiss start event', () => {
    const expected: ApprovalWorkflowEvent[] = [
      { event: ApprovalEventType.APPROVED } as ApprovalWorkflowEvent,
      { event: ApprovalEventType.APPROVED } as ApprovalWorkflowEvent,
    ];

    const input = [
      ...expected,
      { event: ApprovalEventType.STARTED } as ApprovalWorkflowEvent,
    ];
    const result = pipe.transform(input);
    expect(result).toStrictEqual(expected);
  });

  test('should return dismiss released event', () => {
    const expected: ApprovalWorkflowEvent[] = [
      { event: ApprovalEventType.APPROVED } as ApprovalWorkflowEvent,
      { event: ApprovalEventType.APPROVED } as ApprovalWorkflowEvent,
    ];

    const input = [
      ...expected,
      { event: ApprovalEventType.RELEASED } as ApprovalWorkflowEvent,
    ];
    const result = pipe.transform(input);
    expect(result).toStrictEqual(expected);
  });

  test('should return dismiss released and started event', () => {
    const expected: ApprovalWorkflowEvent[] = [
      { event: ApprovalEventType.APPROVED } as ApprovalWorkflowEvent,
      { event: ApprovalEventType.APPROVED } as ApprovalWorkflowEvent,
    ];

    const input = [
      ...expected,
      { event: ApprovalEventType.RELEASED } as ApprovalWorkflowEvent,
      { event: ApprovalEventType.STARTED } as ApprovalWorkflowEvent,
    ];
    const result = pipe.transform(input);
    expect(result).toStrictEqual(expected);
  });
});
