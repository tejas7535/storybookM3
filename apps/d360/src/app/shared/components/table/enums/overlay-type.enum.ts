/**
 * The OverlayType Enum.
 *
 * @export
 * @enum {string}
 */
export enum OverlayType {
  Loader = 'loader',
  Message = 'message',
}

export type OverlayTypes = OverlayType.Loader | OverlayType.Message | null;
