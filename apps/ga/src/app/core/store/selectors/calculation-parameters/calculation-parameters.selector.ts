import { translate } from '@jsverse/transloco';
import { createSelector } from '@ngrx/store';

import { ApplicationScenario } from '@ga/features/grease-calculation/calculation-parameters/constants/application-scenarios.model';
import {
  defaultPreferredGreaseOption,
  greaseCategories,
  marketGreases,
} from '@ga/shared/constants';
import {
  AxisOrientation,
  CalculationParameters,
  GreaseCategoryWithEntries,
  InstallationMode,
  LoadInstallation,
  LoadTypes,
  Movement,
  Property,
  SelectedGreases,
} from '@ga/shared/models';
import { Grease } from '@ga/shared/services/greases/greases.service';

import {
  getCalculationParametersState,
  getSettingsState,
} from '../../reducers';
import { getModelId, getSelectedBearing } from '..';
interface LoadDirection {
  [key: string]: boolean;
}

export const getCompetitorsGreases = createSelector(
  getCalculationParametersState,
  (state) => state.competitorsGreases
);

export const getSchaefflerGreases = createSelector(
  getCalculationParametersState,
  (state) => state.schaefflerGreases
);

export const getSelectedMovementType = createSelector(
  getCalculationParametersState,
  (state): Movement => state.movements.type
);

export const getEnvironmentTemperatures = createSelector(
  getCalculationParametersState,
  (
    state
  ): { operatingTemperature: number; environmentTemperature: number } => ({
    operatingTemperature: state.environment.operatingTemperature,
    environmentTemperature: state.environment.environmentTemperature,
  })
);

export const getLoadsInputType = createSelector(
  getCalculationParametersState,
  (state): boolean => state.loads.exact
);

export const getParameterValidity = createSelector(
  getCalculationParametersState,
  (state): boolean => state?.valid
);

export const getParameterUpdating = createSelector(
  getCalculationParametersState,
  (state): boolean => state?.updating
);

export const getProperties = createSelector(
  getCalculationParametersState,
  (state) => state?.properties
);

export const getLoadDirections = createSelector(
  getProperties,
  (properties): LoadDirection =>
    properties
      ?.filter(({ name }: Property) =>
        Object.values(LoadInstallation).includes(name as LoadInstallation)
      )
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce((loadDirections: LoadDirection, property: Property) => {
        loadDirections[property.name] =
          property.value === InstallationMode.fixed;

        return loadDirections;
      }, {})
);

export const axialLoadPossible = createSelector(
  getLoadDirections,
  (loadDirections: LoadDirection): boolean =>
    loadDirections &&
    (loadDirections[LoadInstallation.positiveAxial] ||
      loadDirections[LoadInstallation.negativeAxial])
);

export const radialLoadPossible = createSelector(
  getLoadDirections,
  (loadDirections: LoadDirection): boolean =>
    loadDirections && loadDirections[LoadInstallation.radial]
);

export const getCalculationParameters = createSelector(
  getCalculationParametersState,
  getSelectedBearing,
  getModelId,
  (
    state,
    bearing: string,
    modelId: string
  ): { modelId: string; options: CalculationParameters } => {
    const oscillating = state.movements.shiftAngle &&
      state.movements.shiftFrequency && {
        idlC_OSCILLATION_ANGLE: `${state.movements.shiftAngle.toFixed(1)}`,
        idlC_MOVEMENT_FREQUENCY: `${state.movements.shiftFrequency.toFixed(1)}`,
      };

    const rotating = state.movements.rotationalSpeed && {
      idL_RELATIVE_SPEED_WITHOUT_SIGN: `${state.movements.rotationalSpeed.toFixed(
        1
      )}`,
    };

    const loads = state.loads.exact
      ? {
          idcO_LOAD_INPUT_GREASE_APP: LoadTypes.LB_ENTER_LOAD,
          idcO_RADIAL_LOAD: `${(state.loads.radial || 0).toFixed(1)}`,
          idcO_AXIAL_LOAD: `${(state.loads.axial || 0).toFixed(1)}`,
        }
      : {
          idcO_LOAD_INPUT_GREASE_APP: LoadTypes.LB_INPUT_VIA_LOAD_LEVELS,
          idcO_LOAD_LEVELS: state.loads.loadRatio,
        };

    return (
      state &&
      state?.valid &&
      bearing &&
      modelId && {
        modelId,
        options: {
          idcO_DESIGNATION: `${bearing}`,
          idlC_TYPE_OF_MOVEMENT: state.movements.type,

          idscO_OILTEMP: `${state.environment.operatingTemperature.toFixed(1)}`,
          idslC_TEMPERATURE: `${state.environment.environmentTemperature.toFixed(
            1
          )}`,
          idscO_GREASE_SELECTION_ARCANOL: SelectedGreases.no,
          idscO_INFLUENCE_OF_AMBIENT: state.environment.environmentImpact,
          ...loads,
          ...rotating,
          ...oscillating,
        } as CalculationParameters,
      }
    );
  }
);

export const getPreferredGrease = createSelector(
  getCalculationParametersState,
  (state) => state?.preferredGrease
);

export const getPreferredGreaseOptions = createSelector(
  getPreferredGrease,
  (preferredGrease) => preferredGrease?.greaseOptions
);

export const getAllGreases = createSelector(
  getPreferredGreaseOptions,
  getCompetitorsGreases,
  getSettingsState,
  (preferredGreaseOptions, competitorsGreases): GreaseCategoryWithEntries[] => {
    // Group competitor greases by company
    const competitorsGreasesByCompany: Record<string, Grease[]> = {};

    // Group the greases by company
    for (const grease of competitorsGreases) {
      const { company } = grease;
      if (!competitorsGreasesByCompany[company]) {
        competitorsGreasesByCompany[company] = [];
      }
      competitorsGreasesByCompany[company].push(grease);
    }

    // Convert competitor greases to the expected format for display
    const competitorCategories = Object.entries(
      competitorsGreasesByCompany
    ).map(([company, greases]) => ({
      name: company,
      entries: greases.map((grease) => ({
        text: grease.name,
        id: grease.id,
      })),
      isCompetitor: true,
    }));

    const originalCategories = greaseCategories.map((greaseCategory) => ({
      name: translate(greaseCategory.name),
      entries: greaseCategory.type
        ? marketGreases
            .filter(({ category }) => category === greaseCategory.type)
            .flatMap(
              (marketGreasesCategory: {
                category: string;
                title: string;
                entries: string[];
              }) =>
                marketGreasesCategory.entries.map((entry: string) => ({
                  text: entry,
                  id: marketGreasesCategory.category,
                }))
            )
        : preferredGreaseOptions?.filter(
            ({ id }) =>
              !greaseCategories
                .filter(({ type }) => !!type)
                .map(({ type }) => type)
                .includes(id)
          ),
      isCompetitor: false,
    }));

    return [...originalCategories, ...competitorCategories];
  }
);

export const getPreferredGreaseOptionsLoading = createSelector(
  getPreferredGrease,
  (preferredGrease) => preferredGrease?.loading
);

export const getPreferredGreaseSelection = createSelector(
  getPreferredGrease,
  (preferredGrease) => preferredGrease?.selectedGrease
);

export const getAutomaticLubrication = createSelector(
  getCalculationParametersState,
  (state) => state?.automaticLubrication
);

export const getGreaseApplication = createSelector(
  getCalculationParametersState,
  (state) => state.environment.applicationScenario
);

export const applicationScenarioDisabledHint = createSelector(
  getCalculationParametersState,
  (state): string | undefined => {
    if (state.movements.type === Movement.oscillating) {
      return translate('parameters.applicationScenarioDisabledHintOscillating');
    }

    if (
      state.preferredGrease.selectedGrease !== undefined &&
      state.preferredGrease.selectedGrease.text !==
        defaultPreferredGreaseOption.text
    ) {
      return translate('parameters.applicationScenarioDisabledHintGrease');
    }

    return undefined;
  }
);

export const preselectionDisabledHint = createSelector(
  getCalculationParametersState,
  (state): string | undefined => {
    if (state.movements.type === Movement.oscillating) {
      return translate(
        'parameters.productPreselection.grease.greaseDisabledHintOscillating'
      );
    }

    if (
      state.environment.applicationScenario &&
      state.environment.applicationScenario !== ApplicationScenario.All
    ) {
      return translate(
        'parameters.productPreselection.grease.greaseDisabledHintApplicationScenario'
      );
    }

    return undefined;
  }
);

export const getMotionType = createSelector(
  getCalculationParametersState,
  (state) => state.movements.type
);

export const isVerticalAxisOrientation = createSelector(
  getCalculationParametersState,
  (state) => state.movements?.axisOrientation === AxisOrientation.Vertical
);

export const getSelectedCompetitorGreaseFromPreferred = createSelector(
  getCompetitorsGreases,
  getPreferredGreaseSelection,
  (greases, preferredGrease) => {
    if (!preferredGrease?.id) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      return undefined;
    }

    return greases.find((g) => g.id === preferredGrease.id);
  }
);

export const getMixableGreasesOfSelectedFromPreferred = createSelector(
  getSelectedCompetitorGreaseFromPreferred,
  (grease) => grease?.mixableGreases ?? []
);

export const getMixableSchaefflerGreases = createSelector(
  getMixableGreasesOfSelectedFromPreferred,
  getSchaefflerGreases,
  (mixableGreaseIds, schaefflerGreases) =>
    schaefflerGreases.filter((grease) => mixableGreaseIds.includes(grease.id))
);
