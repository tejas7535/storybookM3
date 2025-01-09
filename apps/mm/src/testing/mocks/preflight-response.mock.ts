/* eslint-disable unicorn/no-null */

import { MMBearingPreflightResponse } from '@mm/shared/models';

/* eslint-disable max-lines */
export const PREFLIGHT_SUCESS_RESPONSE_MOCK: MMBearingPreflightResponse = {
  data: {
    input: [
      {
        id: 'STRING_OUTP_BEARING_DATA',
        title: 'Bearing data',
        fields: [
          {
            defaultValue: '',

            range: null,

            id: 'IDCO_DESIGNATION',
          },
        ],
      },
      {
        id: 'STRING_OUTP_MOUNTING',
        title: 'Mounting',
        fields: [
          {
            defaultValue: 'LB_TAPERED_SHAFT',

            range: [
              {
                id: 'LB_TAPERED_SHAFT',
                title: 'tapered shaft',
              },
              {
                id: 'LB_ADAPTER_SLEEVE',
                title: 'adapter sleeve',
              },
              {
                id: 'LB_ADAPTER_SLEEVE_BEARING_SUPPORTED',
                title: 'adapter sleeve, bearing axially supported',
              },
              {
                id: 'LB_WITHDRAWAL_SLEEVE',
                title: 'withdrawal sleeve, bearing axially supported',
              },
            ],

            id: 'IDMM_BEARING_SEAT',
          },
          {
            defaultValue: 'LB_RADIAL_CLEARANCE_REDUCTION',

            range: [
              {
                id: 'LB_AXIAL_DISPLACEMENT',
                title: 'axial displacement',
              },
              {
                id: 'LB_RADIAL_CLEARANCE_REDUCTION',
                title: 'radial clearance reduction',
              },
            ],

            id: 'IDMM_MEASSURING_METHOD',
          },
          {
            defaultValue: 'LB_MECHANICAL_WITH_NUT',

            range: [
              {
                id: 'LB_MECHANICAL_WITH_NUT',
                title: 'mechanical with nut',
              },
              {
                id: 'LB_MECHANICAL_WITH_HYDRAULIC_NUT',
                title: 'mechanical with hydraulic nut',
              },
              {
                id: 'LB_MECHANICAL_WITH_NUT_AND_THRUST_BOLTS',
                title: 'mechanical with nut and thrust bolts',
              },
              {
                id: 'LB_HYDRAULIC_WITH_THRUST_BOLTS',
                title: 'hydraulically supported with thrust bolts',
              },
              {
                id: 'LB_HYDRAULIC_WITH_HYDRAULIC_NUT',
                title: 'hydraulically supported with hydraulic nut',
              },
            ],

            id: 'IDMM_MOUNTING_METHOD',
          },
          {
            defaultValue: 'LB_HYDNUT1000_E',

            range: [
              {
                id: 'LB_HYDNUT1000_E',
                title: 'HYDNUT1000-E',
              },
            ],

            id: 'IDMM_HYDRAULIC_NUT_TYPE',
          },
          {
            defaultValue: 'LB_ZERO_TO_ONE',

            range: [
              {
                id: 'LB_ZERO_TO_ONE',
                title: '0-1',
              },
              {
                id: 'LB_TWO',
                title: '2',
              },
              {
                id: 'LB_THREE',
                title: '3',
              },
              {
                id: 'LB_FOUR',
                title: '4',
              },
              {
                id: 'LB_FIVE',
                title: '5',
              },
              {
                id: 'LB_SIX_PLUS',
                title: '6+',
              },
            ],

            id: 'IDMM_NUMBER_OF_PREVIOUS_MOUNTINGS',
          },
          {
            defaultValue: 'LB_RADIAL_CLEARANCE_REDUCTION',

            range: [
              {
                id: 'LB_RADIAL_CLEARANCE_REDUCTION',
                title: 'radial clearance reduction',
              },
              {
                id: 'LB_INNER_RING_EXPANSION',
                title: 'Inner raceway expansion',
              },
            ],

            id: 'IDMM_CLEARANCE_REDUCTION_INPUT',
          },
          {
            defaultValue: '0.450',

            range: null,

            id: 'IDMM_INNER_RING_EXPANSION',
          },
          {
            defaultValue: '450.0',
            range: null,
            id: 'IDMM_RADIAL_CLEARANCE_REDUCTION',
          },
        ],
      },
      {
        id: 'STRING_OUTP_SHAFT_DATA',
        title: 'Shaft data',
        fields: [
          {
            defaultValue: '0',

            range: null,

            id: 'IDMM_INNER_SHAFT_DIAMETER',
          },
          {
            defaultValue: 'STEEL_20_DEGREE',

            range: [
              {
                id: 'STEEL_20_DEGREE',
                title: 'steel',
              },
              {
                id: 'STEEL_100_CR_6',
                title: '100Cr6',
              },
              {
                id: 'STEEL_C_45',
                title: 'C45',
              },
              {
                id: 'STEEL_16_MN_CR_5',
                title: '16MnCr5',
              },
              {
                id: 'STEEL_100_CR_MO_7',
                title: '100CrMo7',
              },
              {
                id: 'CAST_IRON_GG14',
                title: 'cast iron GG14',
              },
              {
                id: 'CAST_IRON_GG26',
                title: 'cast iron GG26',
              },
              {
                id: 'CAST_IRON_GGG',
                title: 'cast iron GGG',
              },
              {
                id: 'BRASS',
                title: 'brass',
              },
              {
                id: 'BRONZE',
                title: 'bronze',
              },
              {
                id: 'ALLOY_ALUMINIUM',
                title: 'aluminum alloy',
              },
              {
                id: 'USER_DEFINED_MATERIAL',
                title: 'user defined',
              },
            ],

            id: 'IDMM_SHAFT_MATERIAL',
          },
          {
            defaultValue: '210000',

            range: null,

            id: 'IDMM_MODULUS_OF_ELASTICITY',
          },
          {
            defaultValue: '0.3',

            range: null,

            id: 'IDMM_POISSON_RATIO',
          },
        ],
      },
    ],
  },
};
