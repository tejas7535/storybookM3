import { IotThing } from '../../app/core/store/reducers/bearing/models';

export const BEARING_MOCK: IotThing = {
  '@context': [
    'https://www.w3.org/2019/wot/td/v1',
    {
      '@language': 'en',
      om: 'http://www.ontology-of-units-of-measure.org/resource/om-2/',
    },
  ],
  id: ' 123',
  description: 'windTurbine',
  descriptions: {
    en: 'windTurbine',
  },
  securityDefinitions: {
    sc_oauth2_admin: {
      scheme: 'oauth2',
      token:
        'https://login.microsoftonline.com/67416604-6509-4014-9859-45e709f53d3f/oauth2/v2.0/token',
      scopes: ['admin'],
      flow: 'code',
    },
    sc_oauth2_user: {
      scheme: 'oauth2',
      token:
        'https://login.microsoftonline.com/67416604-6509-4014-9859-45e709f53d3f/oauth2/v2.0/token',
      scopes: ['basic', 'extended'],
      flow: 'code',
    },
  },
  security: ['sc_oauth2_user'],
  properties: {
    windTurbineProperties: {
      type: 'object',
      title: 'Properties of Wind Turbine',
      titles: {
        en: 'Properties of Wind Turbine',
      },
      descriptions: {
        en: 'Properties Info of Wind Turbine',
      },
      description: 'Properties Info of Wind Turbine',
      forms: [
        {
          op: 'readproperty',
          contentType: 'application/json',
          href:
            'http://127.0.0.1:8080/api/things/11/properties/windTurbineProperties',
          'htv:methodName': 'GET',
        },
      ],
      readOnly: true,
      writeOnly: false,
      properties: {
        windTurbineInfo: {
          type: 'object',
          properties: {
            LSP1: {
              type: 'string',
              descriptions: {
                en: '7c96f98a-9b4c-4151-ad53-48d6af29b08c',
              },
              description: '7c96f98a-9b4c-4151-ad53-48d6af29b08c',
            },
            LSP2: {
              type: 'string',
              descriptions: {
                en: 'c96f98a-9b4c-4151-ad53-48d6af29b08c',
              },
              description: 'c96f98a-9b4c-4151-ad53-48d6af29b08c',
            },
            'EDM-Sensor': {
              type: 'string',
              descriptions: {
                en: 'c96f98a-9b4c-4151-ad53-48d6af29b08c',
              },
              description: 'c96f98a-9b4c-4151-ad53-48d6af29b08c',
            },
          },
          required: ['Sensor1', 'Sensor2'],
        },
      },
      required: ['windTurbineInfo'],
    },
    message: {
      type: 'string',
      forms: [
        {
          op: 'readproperty',
          contentType: 'application/json',
          href: 'http://127.0.0.1:8080/api/things/11/properties/message',
          'htv:methodName': 'GET',
        },
      ],
      readOnly: true,
      writeOnly: false,
    },
  },
  events: {
    sensorDataStream: {
      description: 'Provides livestream of Sensordata.',
      subscription: {
        type: 'object',
        properties: {
          callbackURL: {
            type: 'string',
            format: 'uri',
            description:
              'Callback URL provided by subscriber for Webhook notifications.',
            writeOnly: true,
          },
          subscriptionID: {
            type: 'string',
            description:
              'Unique subscription ID for cancellation provided by WebhookThing.',
            readOnly: true,
          },
        },
      },
      data: {
        type: 'Object',
        description: 'Data from streamimg API',
        properties: {
          UUID: {
            type: 'string',
          },
          timestamp: {
            type: 'timestamp',
          },
          'dc2939ac-545a-464f-af8b-b0e25ca8e027': {
            type: 'number',
            unit: 'om:Newton',
          },
          'b9af50f5-f7e8-4940-8aab-0d2122b16220': {
            type: 'number',
            unit: 'om:Newton',
          },
        },
        cancellation: {
          type: 'object',
          properties: {
            subscriptionID: {
              type: 'integer',
              description: 'Required subscription ID to cancel subscription.',
              writeOnly: true,
            },
          },
        },
        uriVariables: {
          subscriptionID: {
            type: 'string',
          },
        },
        forms: [
          {
            op: 'subscribeevent',
            href: '{thing_url}/events/sensorDataStream/subscribe',
            contentType: 'application/json',
            subprotocol: 'websocket',
            'htv:methodName': 'POST',
          },
          {
            op: 'unsubscribeevent',
            href: '{thing_url}/events/sensorDataStream/unsubscribe',
            'htv:methodName': 'DELETE',
          },
        ],
      },
    },
    forms: [
      {
        op: 'readallproperties',
        contentType: 'application/json',
        href: 'http://127.0.0.1:8080/api/things/11/readallproperties',
        'htv:methodName': 'GET',
      },
    ],
  },
};
