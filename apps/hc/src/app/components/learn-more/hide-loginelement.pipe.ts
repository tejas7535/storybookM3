import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hideLoginElements',
  standalone: true,
})
export class HideLoginElementsPipe implements PipeTransform {
  private readonly marker = /\(login\)(.+)\(\/login\)/g;
  /**
   * Removes strings between (login)abc(/login) if needed, retains an *abc* if wanted
   * @param string The string that should be checked and replaced
   * @param hide configuration wether or not the login string should be hidden or visible
   **/
  transform(string: string, hide: boolean): string {
    return hide
      ? this.hideLoggedinSegments(string)
      : this.removeSegmentMarkers(string);
  }

  private removeSegmentMarkers(line: string): string {
    let newline = line;

    [...line.matchAll(this.marker)].forEach((cg) => {
      if (cg.length === 2) {
        newline = newline.replace(cg[0], cg[1]);
      }
    });

    return newline;
  }

  private hideLoggedinSegments(line: string): string {
    return line.replaceAll(this.marker, '');
  }
}
