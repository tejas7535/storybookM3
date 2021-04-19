import { Model, ModelObject, ObjectProperty } from '@caeonline/dynamic-forms';

export interface BxApiObjectModel {
  type: string;
  properties: ObjectProperty[];

  children: BxApiObjectModel[];

  subTypes?: string[];
  childList?: string;
}

export interface BxApiModel {
  rootObject: BxApiObjectModel;
}

export class ModelTransformer {
  public api2local(apiModel: BxApiModel): Model {
    const object = this.api2localObject(apiModel.rootObject);

    return { ...apiModel, rootObject: object };
  }

  public api2localObject(root: BxApiObjectModel): ModelObject {
    const idProperty = root.properties.find(
      (property) => property.name === 'IDCO_IDENTIFICATION'
    );

    if (!idProperty) {
      throw new Error('Cannot find Object Id Property');
    }

    return {
      id: idProperty.value as string,
      type: root.type,
      subTypes: root.subTypes,
      children: root.children.map((child) => this.api2localObject(child)),
      childList: root.childList,
      properties: root.properties,
    };
  }
}
