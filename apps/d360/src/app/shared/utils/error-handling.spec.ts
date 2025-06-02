import { translate } from '@jsverse/transloco';

import { CMPMaterialPhaseInResponse } from '../../feature/customer-material-portfolio/model';
import { MessageType } from '../models/message-type.enum';
import {
  errorsFromSAPtoMessage,
  multiPostResultsToUserMessages,
  PostResult,
  singlePostResultToUserMessage,
} from './error-handling';

const toSucStr = jest
  .fn()
  .mockImplementation((count: number) => `Success for ${count}`);
const toErrStr = jest
  .fn()
  .mockImplementation((count: number) => `Error for ${count}`);
const toWarnStr = jest
  .fn()
  .mockImplementation((count: number) => `Warning for ${count}`);

describe('errorhandling single result', () => {
  it('handles success', () => {
    const testResult: PostResult<CMPMaterialPhaseInResponse> = {
      overallStatus: MessageType.Success,
      overallErrorMsg: null,
      response: [
        {
          materialNumber: '123456789012345',
          result: {
            messageType: MessageType.Success,
            messageClass: null,
            messageNumber: null,
            fallbackMessage: null,
            param1: null,
            param2: null,
            param3: null,
            param4: null,
          },
        },
      ],
    };

    const toast = singlePostResultToUserMessage(
      testResult,
      jest.fn(),
      'Success!'
    );
    expect(toast.variant).toBe('success');
    expect(toast.message).toBe('Success!');
  });

  it('handles http Errors', () => {
    const testResult: PostResult<CMPMaterialPhaseInResponse> = {
      overallStatus: MessageType.Error,
      overallErrorMsg: '400 Something wrong',
      response: [],
    };

    const toast = singlePostResultToUserMessage(
      testResult,
      jest.fn(),
      'Success!'
    );
    expect(toast.variant).toBe('error');
    expect(toast.message).toBe('400 Something wrong');
  });

  it('handles SAP error with correct translation', () => {
    const testResult: PostResult<CMPMaterialPhaseInResponse> = {
      overallStatus: MessageType.Success,
      overallErrorMsg: null,
      response: [
        {
          materialNumber: '123456789012345',
          result: {
            messageType: MessageType.Error,
            messageClass: '/SGD/SCM_SOP_SALES',
            messageNumber: 17,
            fallbackMessage: 'Fallback Error Message',
            param1: null,
            param2: null,
            param3: null,
            param4: null,
          },
        },
      ],
    };

    const toast = singlePostResultToUserMessage(
      testResult,
      errorsFromSAPtoMessage,
      'Success!'
    );

    const expectedError = translate('Fallback Error Message');
    expect(toast.variant).toBe('error');
    expect(toast.message).toContain(expectedError);
  });

  it('handles SAP error when there is no translation', () => {
    const testResult: PostResult<CMPMaterialPhaseInResponse> = {
      overallStatus: MessageType.Success,
      overallErrorMsg: null,
      response: [
        {
          materialNumber: '123456789012345',
          result: {
            messageType: MessageType.Error,
            messageClass: '/SGD/SCM_SOP_SALES',
            messageNumber: -2, // There is no error code -1
            fallbackMessage: 'Fallback Error Message',
            param1: null,
            param2: null,
            param3: null,
            param4: null,
          },
        },
      ],
    };

    const toast = singlePostResultToUserMessage(
      testResult,
      errorsFromSAPtoMessage,
      'Success!'
    );

    expect(toast.variant).toBe('error');
    expect(toast.message).toBe('Fallback Error Message');
  });

  it('handles SAP warning when there is no translation', () => {
    const testResult: PostResult<CMPMaterialPhaseInResponse> = {
      overallStatus: MessageType.Success,
      overallErrorMsg: null,
      response: [
        {
          materialNumber: '123456789012345',
          result: {
            messageType: MessageType.Warning,
            messageClass: '/SGD/SCM_SOP_SALES',
            messageNumber: -1, // There is no error code -1
            fallbackMessage: 'Fallback Warning Message',
            param1: null,
            param2: null,
            param3: null,
            param4: null,
          },
        },
      ],
    };

    const toast = singlePostResultToUserMessage(
      testResult,
      errorsFromSAPtoMessage,
      'Success!'
    );

    expect(toast.variant).toBe('warning');
    expect(toast.message).toBe('Fallback Warning Message');
  });

  it('handles SAP error when there is no more than one result', () => {
    const testResult: PostResult<CMPMaterialPhaseInResponse> = {
      overallStatus: MessageType.Success,
      overallErrorMsg: null,
      response: [
        {
          materialNumber: '123456789012345',
          result: {
            messageType: MessageType.Success,
            messageClass: null,
            messageNumber: null,
            fallbackMessage: null,
            param1: null,
            param2: null,
            param3: null,
            param4: null,
          },
        },
        {
          materialNumber: '123456789012345',
          result: {
            messageType: MessageType.Error,
            messageClass: '/SGD/SCM_SOP_SALES',
            messageNumber: 17,
            fallbackMessage: 'Fallback Error Message',
            param1: null,
            param2: null,
            param3: null,
            param4: null,
          },
        },
      ],
    };

    const toast = singlePostResultToUserMessage(
      testResult,
      errorsFromSAPtoMessage,
      'Success!'
    );

    const expectedError = translate('Fallback Error Message');
    expect(toast.variant).toBe('error');
    expect(toast.message).toContain(expectedError);
  });
});

describe('errorhandling multi result', () => {
  it('handles success', () => {
    const testResult: PostResult<CMPMaterialPhaseInResponse> = {
      overallStatus: MessageType.Success,
      overallErrorMsg: null,
      response: [
        {
          materialNumber: '123456789012345',
          result: {
            messageType: MessageType.Success,
            messageClass: null,
            messageNumber: null,
            fallbackMessage: null,
            param1: null,
            param2: null,
            param3: null,
            param4: null,
          },
        },
        {
          materialNumber: '123456789012346',
          result: {
            messageType: MessageType.Success,
            messageClass: null,
            messageNumber: null,
            fallbackMessage: null,
            param1: null,
            param2: null,
            param3: null,
            param4: null,
          },
        },
      ],
    };

    const toast = multiPostResultsToUserMessages(
      testResult,
      toSucStr,
      toErrStr,
      toWarnStr
    );
    expect(toast.length).toBe(1);
    expect(toSucStr).toHaveBeenCalledWith(2);
    expect(toast[0].variant).toBe('success');
  });

  it('handles http Errors', () => {
    const testResult: PostResult<CMPMaterialPhaseInResponse> = {
      overallStatus: MessageType.Error,
      overallErrorMsg: '400 Something wrong',
      response: [],
    };

    const toast = multiPostResultsToUserMessages(
      testResult,
      toSucStr,
      toErrStr,
      toWarnStr
    );
    expect(toast.length).toBe(1);
    expect(toast[0].variant).toBe('error');
    expect(toast[0].message).toBe('400 Something wrong');
  });

  it('handles SAP errors and warnings and succeses', () => {
    const testResult: PostResult<CMPMaterialPhaseInResponse> = {
      overallStatus: MessageType.Success,
      overallErrorMsg: null,
      response: [
        {
          materialNumber: '123456789012345',
          result: {
            messageType: MessageType.Warning,
            messageClass: '/SGD/SCM_SOP_SALES',
            messageNumber: 17,
            fallbackMessage: 'Fallback Error Message',
            param1: null,
            param2: null,
            param3: null,
            param4: null,
          },
        },
        {
          materialNumber: '123456789012346',
          result: {
            messageType: MessageType.Error,
            messageClass: '/SGD/SCM_SOP_SALES',
            messageNumber: 17,
            fallbackMessage: 'Fallback Error Message',
            param1: null,
            param2: null,
            param3: null,
            param4: null,
          },
        },
        {
          materialNumber: '123456789012347',
          result: {
            messageType: MessageType.Success,
            messageClass: null,
            messageNumber: null,
            fallbackMessage: null,
            param1: null,
            param2: null,
            param3: null,
            param4: null,
          },
        },
        {
          materialNumber: '123456789012348',
          result: {
            messageType: MessageType.Error,
            messageClass: '/SGD/SCM_SOP_SALES',
            messageNumber: 18,
            fallbackMessage: 'Fallback Error Message',
            param1: null,
            param2: null,
            param3: null,
            param4: null,
          },
        },
      ],
    };

    const toast = multiPostResultsToUserMessages(
      testResult,
      toSucStr,
      toErrStr,
      toWarnStr
    );

    expect(toast.length).toBe(3);
    expect(toSucStr).toHaveBeenCalledWith(1);
    expect(toWarnStr).toHaveBeenCalledWith(1);
    expect(toErrStr).toHaveBeenCalledWith(2);
  });

  it('handles SAP errors with additional error count', () => {
    const testResult: PostResult<CMPMaterialPhaseInResponse> = {
      overallStatus: MessageType.Success,
      overallErrorMsg: null,
      response: [
        {
          materialNumber: '123456789012345',
          result: {
            messageType: MessageType.Error,
            messageClass: '/SGD/SCM_SOP_SALES',
            messageNumber: 17,
            fallbackMessage: 'Fallback Error Message',
            param1: null,
            param2: null,
            param3: null,
            param4: null,
          },
        },
        {
          materialNumber: '123456789012346',
          result: {
            messageType: MessageType.Error,
            messageClass: '/SGD/SCM_SOP_SALES',
            messageNumber: 18,
            fallbackMessage: 'Another Error Message',
            param1: null,
            param2: null,
            param3: null,
            param4: null,
          },
        },
      ],
    };

    const additionalErrorCount = 3;
    const toast = multiPostResultsToUserMessages(
      testResult,
      toSucStr,
      toErrStr,
      toWarnStr,
      additionalErrorCount
    );

    expect(toast.length).toBe(1);
    expect(toErrStr).toHaveBeenCalledWith(5); // 2 from response + 3 additional
    expect(toast[0].variant).toBe('error');
  });

  it('handles http Error with null overallErrorMsg', () => {
    const testResult: PostResult<CMPMaterialPhaseInResponse> = {
      overallStatus: MessageType.Error,
      overallErrorMsg: null,
      response: [],
    };

    const toast = multiPostResultsToUserMessages(
      testResult,
      toSucStr,
      toErrStr,
      toWarnStr
    );
    expect(toast.length).toBe(1);
    expect(toast[0].variant).toBe('error');
    expect(toast[0].message).toBe(translate('error.unknown', {}));
  });

  it('handles multiple warnings only', () => {
    const testResult: PostResult<CMPMaterialPhaseInResponse> = {
      overallStatus: MessageType.Success,
      overallErrorMsg: null,
      response: [
        {
          materialNumber: '123456789012345',
          result: {
            messageType: MessageType.Warning,
            messageClass: '/SGD/SCM_SOP_SALES',
            messageNumber: 17,
            fallbackMessage: 'Warning Message 1',
            param1: null,
            param2: null,
            param3: null,
            param4: null,
          },
        },
        {
          materialNumber: '123456789012346',
          result: {
            messageType: MessageType.Warning,
            messageClass: '/SGD/SCM_SOP_SALES',
            messageNumber: 18,
            fallbackMessage: 'Warning Message 2',
            param1: null,
            param2: null,
            param3: null,
            param4: null,
          },
        },
      ],
    };

    const toast = multiPostResultsToUserMessages(
      testResult,
      toSucStr,
      toErrStr,
      toWarnStr
    );

    expect(toast.length).toBe(1);
    expect(toWarnStr).toHaveBeenCalledWith(2);
    expect(toast[0].variant).toBe('warning');
  });

  it('handles empty response array', () => {
    const testResult: PostResult<CMPMaterialPhaseInResponse> = {
      overallStatus: MessageType.Success,
      overallErrorMsg: null,
      response: [],
    };

    const toast = multiPostResultsToUserMessages(
      testResult,
      toSucStr,
      toErrStr,
      toWarnStr
    );

    expect(toast.length).toBe(0);
    expect(toSucStr).not.toHaveBeenCalled();
    expect(toWarnStr).not.toHaveBeenCalled();
    expect(toErrStr).not.toHaveBeenCalled();
  });
});
