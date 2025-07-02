/**
 * Handles keyboard events and allows specific keys to trigger a callback.
 *
 * @export
 * @param {KeyboardEvent} event
 * @param {string[]} [allowedKeys=['Enter', ' ']]
 * @return
 */
export function keyHandler(
  event: KeyboardEvent,
  allowedKeys: string[] = ['Enter', ' ']
) {
  event.stopPropagation();
  event.preventDefault();

  return (callback: (...args: any[]) => void, ...args: any[]): void => {
    if (allowedKeys.includes(event.key)) {
      callback(...args);
    }
  };
}
