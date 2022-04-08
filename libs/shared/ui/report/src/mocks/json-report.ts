/* eslint-disable max-lines */
import { Report } from '../lib/models/report.model';

export const jsonReport: Report = {
  identifier: 'outputDescription',
  programName: 'Bearinx',
  programNameID: 'STRING_BEARINX',
  isBeta: true,
  method: 'Auslegung - nominelle Lebensdauer',
  methodID: 'IDM_BASICRATINGLIFE',
  title: 'Auslegung - nominelle Lebensdauer',
  titleID: 'STRING_OUTP_LOAD_DISTRIBUTION__DEFLECTION_AND_LIFE',
  subordinates: [
    {
      identifier: 'textPairList',
      title: 'Berechnung / Einbauvorschlag',
      entries: [['Datum: ', '2021-09-02 16:49:41']],
    },
    {
      identifier: 'textBlock',
      title: 'Achtung',
      subordinates: [
        {
          identifier: 'text',
          text: ['Bitte beachten Sie die Warnungen am Ende der Druckausgabe.'],
        },
      ],
    },
    {
      identifier: 'legalNote',
      legal:
        'Für diese Unterlage behalten wir uns alle Rechte vor, auch für den Fall der Patenterteilung oder Gebrauchsmustereintragung. Die Unterlage ist vertraulich zu behandeln. Ohne unsere schriftliche Zustimmung darf weder die Unterlage selbst, noch Vervielfältigungen davon oder sonstige Wiedergaben des vollständigen oder auszugsweisen Inhalts Dritten zugänglich gemacht werden oder durch den Empfänger in anderer Weise missbräuchlich verwertet werden. Basis der Ausarbeitung der Unterlage sind Ihre oben angeführten Vorgaben und unsere Annahmen. Unsere Angaben berücksichtigen diejenigen Risiken, die uns auf Grund der von Ihnen zur Verfügung gestellten Vorgaben erkennbar waren. Die Erarbeitung der Unterlage erfolgt ausschließlich im Zusammenhang mit dem Erwerb unserer Produkte. Die Ergebnisse der Unterlage sind sorgfältig und nach dem Stand der Technik erarbeitet, stellen jedoch im juristischen Sinne keine Beschaffenheits- oder Haltbarkeitsgarantie dar und ersetzen nicht die von Ihnen zu verifizierende Eignung. Wir haften für die Angaben in der Unterlage nur im Falle von Vorsatz und Fahrlässigkeit. Ist die Unterlage Bestandteil einer Liefervereinbarung gelten die dort vereinbarten Haftungsregeln.',
    },
    {
      identifier: 'textPairList',
      title: 'Inhaltsverzeichnis',
      entries: [
        ['1      ', 'Eingaben'],
        ['1.1    ', 'Bestückungsdaten'],
        ['1.2    ', 'Oberflächenhärte'],
        ['1.3    ', 'Eingabedaten Betriebsspiel'],
        ['1.4    ', 'Betriebsbedingungen'],
        ['2      ', 'Ergebnisse'],
        ['2.1    ', 'Zusammenfassung der Ergebnisse'],
        ['2.2    ', 'Wälzlagerverhalten pro Lastfall'],
        ['2.3    ', 'Ergebnisse der Reihen'],
        [
          '2.3.1  ',
          'Ergebnisse der Wälzkörper, Radialschrägrollenreihe 1, Lastfall 1',
        ],
        ['2.4    ', 'Ergebnisse Betriebsspiel'],
        ['3      ', 'Warnungen'],
      ],
    },
    {
      identifier: 'block',
      title: 'Eingaben',
      titleID: 'STRING_OUTP_INPUT',
      subordinates: [
        {
          identifier: 'variableBlock',
          title: 'Lagerdaten',
          titleID: 'STRING_OUTP_RESULTS',
          subordinates: [
            {
              identifier: 'variableLine',
              designation: 'Bezeichnung',
              value: 'Radialschrägrollenlager 1 (Kopie)',
            },
            {
              identifier: 'variableLine',
              designation: 'Art der Eingabe',
              value: 'benutzerdefiniert',
            },
            {
              identifier: 'variableLine',
              designation: 'Produktmerkmal',
              value: 'Standard',
            },
            {
              identifier: 'variableLine',
              designation: 'Marke',
              value: 'INA',
            },
            {
              identifier: 'variableLine',
              designation: 'Schaeffler Geräuschindex',
              abbreviation: 'SGI',
              value: '0.156',
            },
          ],
        },
        {
          identifier: 'variableBlock',
          title: 'Berechnungsauswahl',
          titleID: 'STRING_OUTP_RESULTS',
          subordinates: [
            {
              identifier: 'variableLine',
              designation: 'Lebensdauer',
              value: 'ja',
            },
            {
              identifier: 'variableLine',
              designation: 'Kontaktberechnung',
              value: 'keine automatische Kontaktberechnung',
            },
            {
              identifier: 'variableLine',
              designation: 'Steifigkeit im Betriebspunkt',
              value: 'keine spezielle Untersuchung',
            },
            {
              identifier: 'variableLine',
              designation: 'Käfigauslegung',
              value: 'nein',
            },
            {
              identifier: 'variableLine',
              designation: 'Berechnung der Laufbahnlastverteilung',
              value: 'nein',
            },
          ],
        },
        {
          identifier: 'variableBlock',
          title: 'Berechnungsoptionen',
          titleID: 'STRING_OUTP_RESULTS',
          subordinates: [
            {
              identifier: 'variableLine',
              designation: 'Stellungsabhängigkeit',
              value: 'stellungsabhängig',
            },
            {
              identifier: 'variableLine',
              designation: 'Lagerring-Konfiguration',
              value: 'starre Lagerringe',
            },
            {
              identifier: 'variableLine',
              designation: 'Profilierte Laufbahnen',
              value: 'keine profilierten Laufbahnen',
            },
            {
              identifier: 'variableLine',
              designation: 'Massenkräfte der Wälzkörper',
              value: 'nicht berücksichtigen',
            },
            {
              identifier: 'variableLine',
              designation: 'Drehzahlen für Leistungsdaten',
              value: 'nicht berechnen',
            },
            {
              identifier: 'variableLine',
              designation: 'Berücksichtigung der Borde',
              value: 'Borde nicht berücksichtigen',
            },
          ],
        },
        {
          identifier: 'variableBlock',
          title: 'Lagerabmessungen',
          titleID: 'STRING_OUTP_RESULTS',
          subordinates: [
            {
              identifier: 'variableLine',
              designation: 'Innendurchmesser',
              abbreviation: 'd',
              value: '30.000',
              unit: 'mm',
            },
            {
              identifier: 'variableLine',
              designation: 'Außendurchmesser',
              abbreviation: 'D',
              value: '62.000',
              unit: 'mm',
            },
            {
              identifier: 'variableLine',
              designation: 'Breite',
              abbreviation: 'B',
              value: '20.000',
              unit: 'mm',
            },
          ],
        },
        {
          identifier: 'block',
          title: 'Bestückungsdaten',
          titleID: 'STRING_OUTP_RESULTS',
          subordinates: [
            {
              identifier: 'variableBlock',
              title: 'Lager',
              titleID: 'STRING_OUTP_RESULTS',
              subordinates: [
                {
                  identifier: 'variableLine',
                  designation: 'Bauform',
                  value: 'Radialschrägrollenlager, einreihig',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Lagerring-Konfiguration',
                  value: 'starre Lagerringe',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Anzahl Reihen',
                  abbreviation: 'i',
                  value: '1',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Anordnung der Borde',
                  value: 'beidseitig außen / beidseitig innen',
                },
              ],
            },
            {
              identifier: 'variableBlock',
              title: 'Reihe(n)',
              titleID: 'STRING_OUTP_RESULTS',
              subordinates: [
                {
                  identifier: 'variableLine',
                  designation: 'Stellung der Reihe',
                  value: 'Scheitelstellung',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Mittenkreisdurchmesser',
                  abbreviation: 'dM',
                  value: '45.000',
                  unit: 'mm',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Nomineller Berührungswinkel',
                  abbreviation: 'alpha_o',
                  value: '25.000',
                  unit: '°',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Axiales Bezugsspiel',
                  abbreviation: 'saB',
                  value: '0.0',
                  unit: 'µm',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Anzahl Wälzkörper pro Reihe',
                  abbreviation: 'Z',
                  value: '15',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Einstichbreite am Innenring',
                  abbreviation: 'ebIR',
                  value: '0.000',
                  unit: 'mm',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Einstichbreite am Außenring',
                  abbreviation: 'ebAR',
                  value: '0.000',
                  unit: 'mm',
                },
              ],
            },
            {
              identifier: 'variableBlock',
              title: 'Wälzkörper',
              titleID: 'STRING_OUTP_RESULTS',
              subordinates: [
                {
                  identifier: 'variableLine',
                  designation: 'Wälzkörperdurchmesser',
                  abbreviation: 'Dw',
                  value: '8.000',
                  unit: 'mm',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Wälzkörperlänge',
                  abbreviation: 'Lw',
                  value: '12.000',
                  unit: 'mm',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Auswahl für leff',
                  value: 'berechnen (r_2 INA-WN)',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Effektive Berührlänge',
                  abbreviation: 'leff',
                  value: '11.600',
                  unit: 'mm',
                },
              ],
            },
            {
              identifier: 'variableBlock',
              title: 'Profildaten',
              titleID: 'STRING_OUTP_RESULTS',
              subordinates: [
                {
                  identifier: 'variableLine',
                  designation: 'Profiltyp',
                  value: 'INA Zylinderrolle - Standard',
                },
              ],
            },
          ],
        },
        {
          identifier: 'block',
          title: 'Oberflächenhärte',
          titleID: 'STRING_OUTP_RESULTS',
          subordinates: [
            {
              identifier: 'variableBlock',
              title: 'Innenring',
              titleID: 'STRING_OUTP_RESULTS',
              subordinates: [
                {
                  identifier: 'variableLine',
                  designation: 'Oberflächenhärte',
                  abbreviation: 'HO',
                  value: '670.00',
                  unit: 'HV',
                },
              ],
            },
            {
              identifier: 'variableBlock',
              title: 'Außenring',
              titleID: 'STRING_OUTP_RESULTS',
              subordinates: [
                {
                  identifier: 'variableLine',
                  designation: 'Oberflächenhärte',
                  abbreviation: 'HO',
                  value: '670.00',
                  unit: 'HV',
                },
              ],
            },
          ],
        },
        {
          identifier: 'block',
          title: 'Eingabedaten Betriebsspiel',
          titleID: 'STRING_OUTP_RESULTS',
          subordinates: [
            {
              identifier: 'table',
              title: 'Lagerluft, Betriebsspiel',
              titleID: 'STRING_OUTP_RESULTS',
              data: {
                fields: ['OC_L', 'f_s', 'sa_e_max', 'sa_e_min'],
                unitFields: [
                  undefined,
                  undefined,
                  {
                    unit: 'µm',
                  },
                  {
                    unit: 'µm',
                  },
                ],
                items: [
                  [
                    {
                      field: 'OC_L',
                      value: 'gemittelt',
                    },
                    {
                      field: 'f_s',
                      value: 'nach DIN 7190 - veraltet (0.8)',
                    },
                    {
                      field: 'sa_e_max',
                      value: '-40.0',
                      unit: 'µm',
                    },
                    {
                      field: 'sa_e_min',
                      value: '-40.0',
                      unit: 'µm',
                    },
                  ],
                ],
              },
            },
            {
              identifier: 'table',
              title:
                'Ringdurchmesser und Toleranzen, Glättungsfaktor, nach DIN 7190 - veraltet (0.8)',
              titleID: 'STRING_OUTP_RESULTS',
              data: {
                fields: [
                  'Ring',
                  'D',
                  'Tol',
                  'FO',
                  'FU',
                  'Rz',
                  'd',
                  'FO',
                  'FU',
                  'Rz',
                ],
                unitFields: [
                  undefined,
                  {
                    unit: 'mm',
                  },
                  undefined,
                  {
                    unit: 'µm',
                  },
                  {
                    unit: 'µm',
                  },
                  {
                    unit: 'µm',
                  },
                  {
                    unit: 'mm',
                  },
                  {
                    unit: 'µm',
                  },
                  {
                    unit: 'µm',
                  },
                  {
                    unit: 'µm',
                  },
                ],
                items: [
                  [
                    {
                      field: 'Ring',
                      value: 'Gehäuse',
                    },
                    {
                      field: 'D',
                      value: '90.000',
                      unit: 'mm',
                    },
                    {
                      field: 'Tol',
                      value: undefined,
                    },
                    {
                      field: 'FO',
                      value: undefined,
                      unit: 'µm',
                    },
                    {
                      field: 'FU',
                      value: undefined,
                      unit: 'µm',
                    },
                    {
                      field: 'Rz',
                      value: undefined,
                      unit: 'µm',
                    },
                    {
                      field: 'd',
                      value: '62.000',
                      unit: 'mm',
                    },
                    {
                      field: 'FO',
                      value: '0.0',
                      unit: 'µm',
                    },
                    {
                      field: 'FU',
                      value: '0.0',
                      unit: 'µm',
                    },
                    {
                      field: 'Rz',
                      value: '0.0',
                      unit: 'µm',
                    },
                  ],
                  [
                    {
                      field: 'Ring',
                      value: 'Außenring 1',
                    },
                    {
                      field: 'D',
                      value: '62.000',
                      unit: 'mm',
                    },
                    {
                      field: 'Tol',
                      value: undefined,
                    },
                    {
                      field: 'FO',
                      value: '0.0',
                      unit: 'µm',
                    },
                    {
                      field: 'FU',
                      value: '0.0',
                      unit: 'µm',
                    },
                    {
                      field: 'Rz',
                      value: '0.0',
                      unit: 'µm',
                    },
                    {
                      field: 'd',
                      value: undefined,
                      unit: 'mm',
                    },
                    {
                      field: 'FO',
                      value: undefined,
                      unit: 'µm',
                    },
                    {
                      field: 'FU',
                      value: undefined,
                      unit: 'µm',
                    },
                    {
                      field: 'Rz',
                      value: undefined,
                      unit: 'µm',
                    },
                  ],
                  [
                    {
                      field: 'Ring',
                      value: 'Innenring 1',
                    },
                    {
                      field: 'D',
                      value: undefined,
                      unit: 'mm',
                    },
                    {
                      field: 'Tol',
                      value: undefined,
                    },
                    {
                      field: 'FO',
                      value: undefined,
                      unit: 'µm',
                    },
                    {
                      field: 'FU',
                      value: undefined,
                      unit: 'µm',
                    },
                    {
                      field: 'Rz',
                      value: undefined,
                      unit: 'µm',
                    },
                    {
                      field: 'd',
                      value: '30.000',
                      unit: 'mm',
                    },
                    {
                      field: 'FO',
                      value: '-10.0',
                      unit: 'µm',
                    },
                    {
                      field: 'FU',
                      value: '-10.0',
                      unit: 'µm',
                    },
                    {
                      field: 'Rz',
                      value: '0.0',
                      unit: 'µm',
                    },
                  ],
                  [
                    {
                      field: 'Ring',
                      value: 'Welle',
                    },
                    {
                      field: 'D',
                      value: '30.000',
                      unit: 'mm',
                    },
                    {
                      field: 'Tol',
                      value: undefined,
                    },
                    {
                      field: 'FO',
                      value: '28.0',
                      unit: 'µm',
                    },
                    {
                      field: 'FU',
                      value: '28.0',
                      unit: 'µm',
                    },
                    {
                      field: 'Rz',
                      value: '0.0',
                      unit: 'µm',
                    },
                    {
                      field: 'd',
                      value: '0.000',
                      unit: 'mm',
                    },
                    {
                      field: 'FO',
                      value: undefined,
                      unit: 'µm',
                    },
                    {
                      field: 'FU',
                      value: undefined,
                      unit: 'µm',
                    },
                    {
                      field: 'Rz',
                      value: undefined,
                      unit: 'µm',
                    },
                  ],
                ],
              },
            },
            {
              identifier: 'table',
              title: 'Axiale Vorspannung',
              titleID: 'STRING_OUTP_RESULTS',
              data: {
                fields: ['Ring', 'Fa'],
                unitFields: [
                  undefined,
                  {
                    unit: 'N',
                  },
                ],
                items: [
                  [
                    {
                      field: 'Ring',
                      value: 'Gehäuse',
                    },
                    {
                      field: 'Fa',
                      value: '0.00',
                      unit: 'N',
                    },
                  ],
                  [
                    {
                      field: 'Ring',
                      value: 'Außenring 1',
                    },
                    {
                      field: 'Fa',
                      value: '0.00',
                      unit: 'N',
                    },
                  ],
                  [
                    {
                      field: 'Ring',
                      value: 'Innenring 1',
                    },
                    {
                      field: 'Fa',
                      value: '0.00',
                      unit: 'N',
                    },
                  ],
                  [
                    {
                      field: 'Ring',
                      value: 'Welle',
                    },
                    {
                      field: 'Fa',
                      value: '0.00',
                      unit: 'N',
                    },
                  ],
                ],
              },
            },
            {
              identifier: 'table',
              title: 'Temperaturen der Lagerkomponenten',
              titleID: 'STRING_OUTP_RESULTS',
              data: {
                fields: [
                  'Lastfall',
                  'Welle',
                  'Innenring',
                  'Wälzkörper',
                  'Außenring',
                  'Gehäuse',
                ],
                unitFields: [
                  undefined,
                  {
                    unit: '°C',
                  },
                  {
                    unit: '°C',
                  },
                  {
                    unit: '°C',
                  },
                  {
                    unit: '°C',
                  },
                  {
                    unit: '°C',
                  },
                ],
                items: [
                  [
                    {
                      field: 'Lastfall',
                      value: 'Lastfall 1',
                    },
                    {
                      field: 'Welle',
                      value: '20.0',
                      unit: '°C',
                    },
                    {
                      field: 'Innenring',
                      value: '20.0',
                      unit: '°C',
                    },
                    {
                      field: 'Wälzkörper',
                      value: '20.0',
                      unit: '°C',
                    },
                    {
                      field: 'Außenring',
                      value: '20.0',
                      unit: '°C',
                    },
                    {
                      field: 'Gehäuse',
                      value: '20.0',
                      unit: '°C',
                    },
                  ],
                ],
              },
            },
            {
              identifier: 'table',
              title: 'Materialdaten',
              titleID: 'STRING_OUTP_RESULTS',
              data: {
                fields: ['', 'material', 'E', 'Nue', 'Alp', 'rho'],
                unitFields: [
                  undefined,
                  undefined,
                  {
                    unit: 'N/mm²',
                  },
                  undefined,
                  {
                    unit: '1/K',
                  },
                  {
                    unit: 'kg/m³',
                  },
                ],
                items: [
                  [
                    {
                      field: '',
                      value: 'Gehäuse',
                    },
                    {
                      field: 'material',
                      value: 'Stahl',
                    },
                    {
                      field: 'E',
                      value: '210000',
                      unit: 'N/mm²',
                    },
                    {
                      field: 'Nue',
                      value: '0.300',
                    },
                    {
                      field: 'Alp',
                      value: '0.0000115',
                      unit: '1/K',
                    },
                    {
                      field: 'rho',
                      value: '7810.000',
                      unit: 'kg/m³',
                    },
                  ],
                  [
                    {
                      field: '',
                      value: 'Welle',
                    },
                    {
                      field: 'material',
                      value: 'Stahl',
                    },
                    {
                      field: 'E',
                      value: '210000',
                      unit: 'N/mm²',
                    },
                    {
                      field: 'Nue',
                      value: '0.300',
                    },
                    {
                      field: 'Alp',
                      value: '0.0000115',
                      unit: '1/K',
                    },
                    {
                      field: 'rho',
                      value: '7810.000',
                      unit: 'kg/m³',
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          identifier: 'block',
          title: 'Betriebsbedingungen',
          titleID: 'STRING_OUTP_RESULTS',
          subordinates: [
            {
              identifier: 'table',
              title: 'Betriebsbedingungen für alle Lastfälle',
              titleID: 'STRING_OUTP_RESULTS',
              data: {
                fields: ['Lastfall', 'q', 'n_i(Innenring)', 'n_i(Außenring)'],
                unitFields: [
                  undefined,
                  {
                    unit: '%',
                  },
                  {
                    unit: '1/min',
                  },
                  {
                    unit: '1/min',
                  },
                ],
                items: [
                  [
                    {
                      field: 'Lastfall',
                      value: 'Lastfall 1',
                    },
                    {
                      field: 'q',
                      value: '100.000',
                      unit: '%',
                    },
                    {
                      field: 'n_i(Innenring)',
                      value: '0.00',
                      unit: '1/min',
                    },
                    {
                      field: 'n_i(Außenring)',
                      value: '0.00',
                      unit: '1/min',
                    },
                  ],
                ],
              },
            },
            {
              identifier: 'table',
              title: 'Belastungen bzw. Verlagerungen für alle Lastfälle',
              titleID: 'STRING_OUTP_RESULTS',
              data: {
                fields: ['Lastfall', 'Fx', 'Fy', 'Fz', 'My', 'Mz'],
                unitFields: [
                  undefined,
                  {
                    unit: 'N',
                  },
                  {
                    unit: 'N',
                  },
                  {
                    unit: 'N',
                  },
                  {
                    unit: 'N m',
                  },
                  {
                    unit: 'N m',
                  },
                ],
                items: [
                  [
                    {
                      field: 'Lastfall',
                      value: 'Lastfall 1',
                    },
                    {
                      field: 'Fx',
                      value: '10.00',
                      unit: 'N',
                    },
                    {
                      field: 'Fy',
                      value: '0.00',
                      unit: 'N',
                    },
                    {
                      field: 'Fz',
                      value: '0.00',
                      unit: 'N',
                    },
                    {
                      field: 'My',
                      value: '0.000',
                      unit: 'N m',
                    },
                    {
                      field: 'Mz',
                      value: '0.000',
                      unit: 'N m',
                    },
                  ],
                ],
              },
              description: {
                identifier: 'textPairList',
                title: 'Tabellenerklärungen:',
                entries: [
                  ['Fx: ', 'Kraft in x-Richtung'],
                  ['Fy: ', 'Kraft in y-Richtung'],
                  ['Fz: ', 'Kraft in z-Richtung'],
                  ['My: ', 'Moment um y-Achse'],
                  ['Mz: ', 'Moment um z-Achse'],
                ],
              },
            },
          ],
        },
      ],
    },
    {
      identifier: 'block',
      title: 'Ergebnisse',
      titleID: 'STRING_OUTP_RESULTS',
      subordinates: [
        {
          identifier: 'block',
          title: 'Zusammenfassung der Ergebnisse',
          titleID: 'STRING_OUTP_RESULTS',
          subordinates: [
            {
              identifier: 'variableBlock',
              title: 'Wälzlagerverhalten (kf)',
              titleID: 'STRING_OUTP_RESULTS',
              subordinates: [
                {
                  identifier: 'variableLine',
                  designation: 'Lebensdauer (nominell)',
                  abbreviation: 'Lh10 (kf)',
                  value: '> 10000000',
                  unit: 'h',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Äquivalente dynamische Belastung (kf)',
                  abbreviation: 'P (kf)',
                  value: '18.43',
                  unit: 'N',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Äquivalente Drehzahl',
                  abbreviation: 'n',
                  value: '0.0',
                  unit: '1/min',
                },
              ],
            },
            {
              identifier: 'variableBlock',
              title: 'Wälzlagerverhalten (statisch)',
              titleID: 'STRING_OUTP_RESULTS',
              subordinates: [
                {
                  identifier: 'variableLine',
                  designation: 'Maximale äquivalente statische Belastung (k0f)',
                  abbreviation: 'P0_max (k0f)',
                  value: '5.16',
                  unit: 'N',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Statische Tragsicherheit (k0f)',
                  abbreviation: 'S0_min (k0f)',
                  value: '> 100.000',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Wirksame statische Tragsicherheit',
                  abbreviation: 'S0_w_min',
                  value: '> 100.000',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Maximaler Lastquotient in Nennlastrichtung',
                  abbreviation: 'C0/Fn_min',
                  value: '> 100.0',
                },
              ],
            },
            {
              identifier: 'variableBlock',
              title: 'Tragzahlen',
              titleID: 'STRING_OUTP_RESULTS',
              subordinates: [
                {
                  identifier: 'variableLine',
                  designation: 'Dynamische Tragzahl',
                  abbreviation: 'C',
                  value: '39500',
                  unit: 'N',
                },
                {
                  identifier: 'variableLine',
                  designation: 'Statische Tragzahl',
                  abbreviation: 'C0',
                  value: '46500',
                  unit: 'N',
                },
              ],
            },
          ],
        },
        {
          identifier: 'block',
          title: 'Wälzlagerverhalten pro Lastfall',
          titleID: 'STRING_OUTP_RESULTS',
          subordinates: [
            {
              identifier: 'table',
              title: 'Wälzlagerverhalten (kf)',
              titleID: 'STRING_OUTP_RESULTS',
              data: {
                fields: ['Lastfall', 'Lh10_i (kf)', 'P_i (kf)', 'n_i'],
                unitFields: [
                  undefined,
                  {
                    unit: 'h',
                  },
                  {
                    unit: 'N',
                  },
                  {
                    unit: '1/min',
                  },
                ],
                items: [
                  [
                    {
                      field: 'Lastfall',
                      value: 'Lastfall 1',
                    },
                    {
                      field: 'Lh10_i (kf)',
                      value: '> 10000000',
                      unit: 'h',
                    },
                    {
                      field: 'P_i (kf)',
                      value: '18.43',
                      unit: 'N',
                    },
                    {
                      field: 'n_i',
                      value: '0.00',
                      unit: '1/min',
                    },
                  ],
                ],
              },
            },
            {
              identifier: 'table',
              title: 'Wälzlagerverhalten (statisch)',
              titleID: 'STRING_OUTP_RESULTS',
              data: {
                fields: ['Lastfall', 'P0 (k0f)', 'S0 (k0f)', 'S0_w', 'C0/Fn'],
                unitFields: [
                  undefined,
                  {
                    unit: 'N',
                  },
                  undefined,
                  undefined,
                  undefined,
                ],
                items: [
                  [
                    {
                      field: 'Lastfall',
                      value: 'Lastfall 1',
                    },
                    {
                      field: 'P0 (k0f)',
                      value: '5.16',
                      unit: 'N',
                    },
                    {
                      field: 'S0 (k0f)',
                      value: '> 100.000',
                    },
                    {
                      field: 'S0_w',
                      value: '> 100.000',
                    },
                    {
                      field: 'C0/Fn',
                      value: '> 100.0',
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          identifier: 'table',
          title: 'Belastungen bzw. Verlagerungen',
          titleID: 'STRING_OUTP_RESULTS',
          data: {
            fields: ['Lastfall', 'DelVx', 'DelVy', 'DelVz', 'Phiy', 'Phiz'],
            unitFields: [
              undefined,
              {
                unit: 'mm',
              },
              {
                unit: 'mm',
              },
              {
                unit: 'mm',
              },
              {
                unit: 'mrad',
              },
              {
                unit: 'mrad',
              },
            ],
            items: [
              [
                {
                  field: 'Lastfall',
                  value: 'Lastfall 1',
                },
                {
                  field: 'DelVx',
                  value: '-0.0399',
                  unit: 'mm',
                },
                {
                  field: 'DelVy',
                  value: '0.0000',
                  unit: 'mm',
                },
                {
                  field: 'DelVz',
                  value: '0.0000',
                  unit: 'mm',
                },
                {
                  field: 'Phiy',
                  value: '0.0000',
                  unit: 'mrad',
                },
                {
                  field: 'Phiz',
                  value: '0.0000',
                  unit: 'mrad',
                },
              ],
            ],
          },
        },
        {
          identifier: 'table',
          title: 'Überrollfrequenzen',
          titleID: 'STRING_OUTP_RESULTS',
          data: {
            fields: ['Lastfall', 'fi', 'fo', 'fr', 'f_c'],
            unitFields: [
              undefined,
              {
                unit: '1/s',
              },
              {
                unit: '1/s',
              },
              {
                unit: '1/s',
              },
              {
                unit: '1/s',
              },
            ],
            items: [
              [
                {
                  field: 'Lastfall',
                  value: 'Lastfall 1',
                },
                {
                  field: 'fi',
                  value: '0.00',
                  unit: '1/s',
                },
                {
                  field: 'fo',
                  value: '0.00',
                  unit: '1/s',
                },
                {
                  field: 'fr',
                  value: '0.00',
                  unit: '1/s',
                },
                {
                  field: 'f_c',
                  value: '0.00',
                  unit: '1/s',
                },
              ],
            ],
          },
        },
        {
          identifier: 'block',
          title: 'Ergebnisse der Reihen',
          titleID: 'STRING_OUTP_RESULTS',
          subordinates: [
            {
              identifier: 'table',
              title: 'Belastungen bzw. Verlagerungen',
              titleID: 'STRING_OUTP_RESULTS',
              data: {
                fields: [
                  'Reihe',
                  'Lastfall',
                  'FxR',
                  'FyR',
                  'FzR',
                  'MyR',
                  'MzR',
                  'DelxR',
                  'DelyR',
                  'DelzR',
                  'PhiyR',
                  'PhizR',
                ],
                unitFields: [
                  undefined,
                  undefined,
                  {
                    unit: 'N',
                  },
                  {
                    unit: 'N',
                  },
                  {
                    unit: 'N',
                  },
                  {
                    unit: 'N m',
                  },
                  {
                    unit: 'N m',
                  },
                  {
                    unit: 'mm',
                  },
                  {
                    unit: 'mm',
                  },
                  {
                    unit: 'mm',
                  },
                  {
                    unit: 'mrad',
                  },
                  {
                    unit: 'mrad',
                  },
                ],
                items: [
                  [
                    {
                      field: 'Reihe',
                      value: 'Radialschrägrollenreihe 1',
                    },
                    {
                      field: 'Lastfall',
                      value: 'Lastfall 1',
                    },
                    {
                      field: 'FxR',
                      value: '10.00',
                      unit: 'N',
                    },
                    {
                      field: 'FyR',
                      value: '0.00',
                      unit: 'N',
                    },
                    {
                      field: 'FzR',
                      value: '0.00',
                      unit: 'N',
                    },
                    {
                      field: 'MyR',
                      value: '0.000',
                      unit: 'N m',
                    },
                    {
                      field: 'MzR',
                      value: '0.000',
                      unit: 'N m',
                    },
                    {
                      field: 'DelxR',
                      value: '-0.0399',
                      unit: 'mm',
                    },
                    {
                      field: 'DelyR',
                      value: '0.0000',
                      unit: 'mm',
                    },
                    {
                      field: 'DelzR',
                      value: '0.0000',
                      unit: 'mm',
                    },
                    {
                      field: 'PhiyR',
                      value: '0.0000',
                      unit: 'mrad',
                    },
                    {
                      field: 'PhizR',
                      value: '0.0000',
                      unit: 'mrad',
                    },
                  ],
                ],
              },
            },
            {
              identifier: 'block',
              title:
                'Ergebnisse der Wälzkörper, Radialschrägrollenreihe 1, Lastfall 1',
              titleID: 'STRING_OUTP_RESULTS',
              subordinates: [
                {
                  identifier: 'table',
                  title:
                    'Ergebnisse der Wälzkörper, Radialschrägrollenreihe 1, Lastfall 1',
                  titleID: 'STRING_OUTP_RESULTS',
                  data: {
                    fields: ['WK', 'QR', 'MR', 'Del', 'Phi_w', 'phi_IR', 'Chi'],
                    unitFields: [
                      undefined,
                      {
                        unit: 'N',
                      },
                      {
                        unit: 'N m',
                      },
                      {
                        unit: 'mm',
                      },
                      {
                        unit: 'mrad',
                      },
                      {
                        unit: 'mrad',
                      },
                      undefined,
                    ],
                    items: [
                      [
                        {
                          field: 'WK',
                          value: '1',
                        },
                        {
                          field: 'QR',
                          value: '1.58',
                          unit: 'N',
                        },
                        {
                          field: 'MR',
                          value: '0.000',
                          unit: 'N m',
                        },
                        {
                          field: 'Del',
                          value: '0.0000',
                          unit: 'mm',
                        },
                        {
                          field: 'Phi_w',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'phi_IR',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'Chi',
                          value: '0.384',
                        },
                      ],
                      [
                        {
                          field: 'WK',
                          value: '2',
                        },
                        {
                          field: 'QR',
                          value: '1.58',
                          unit: 'N',
                        },
                        {
                          field: 'MR',
                          value: '0.000',
                          unit: 'N m',
                        },
                        {
                          field: 'Del',
                          value: '0.0000',
                          unit: 'mm',
                        },
                        {
                          field: 'Phi_w',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'phi_IR',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'Chi',
                          value: '0.384',
                        },
                      ],
                      [
                        {
                          field: 'WK',
                          value: '3',
                        },
                        {
                          field: 'QR',
                          value: '1.58',
                          unit: 'N',
                        },
                        {
                          field: 'MR',
                          value: '0.000',
                          unit: 'N m',
                        },
                        {
                          field: 'Del',
                          value: '0.0000',
                          unit: 'mm',
                        },
                        {
                          field: 'Phi_w',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'phi_IR',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'Chi',
                          value: '0.384',
                        },
                      ],
                      [
                        {
                          field: 'WK',
                          value: '4',
                        },
                        {
                          field: 'QR',
                          value: '1.58',
                          unit: 'N',
                        },
                        {
                          field: 'MR',
                          value: '0.000',
                          unit: 'N m',
                        },
                        {
                          field: 'Del',
                          value: '0.0000',
                          unit: 'mm',
                        },
                        {
                          field: 'Phi_w',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'phi_IR',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'Chi',
                          value: '0.384',
                        },
                      ],
                      [
                        {
                          field: 'WK',
                          value: '5',
                        },
                        {
                          field: 'QR',
                          value: '1.58',
                          unit: 'N',
                        },
                        {
                          field: 'MR',
                          value: '0.000',
                          unit: 'N m',
                        },
                        {
                          field: 'Del',
                          value: '0.0000',
                          unit: 'mm',
                        },
                        {
                          field: 'Phi_w',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'phi_IR',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'Chi',
                          value: '0.384',
                        },
                      ],
                      [
                        {
                          field: 'WK',
                          value: '6',
                        },
                        {
                          field: 'QR',
                          value: '1.58',
                          unit: 'N',
                        },
                        {
                          field: 'MR',
                          value: '0.000',
                          unit: 'N m',
                        },
                        {
                          field: 'Del',
                          value: '0.0000',
                          unit: 'mm',
                        },
                        {
                          field: 'Phi_w',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'phi_IR',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'Chi',
                          value: '0.384',
                        },
                      ],
                      [
                        {
                          field: 'WK',
                          value: '7',
                        },
                        {
                          field: 'QR',
                          value: '1.58',
                          unit: 'N',
                        },
                        {
                          field: 'MR',
                          value: '0.000',
                          unit: 'N m',
                        },
                        {
                          field: 'Del',
                          value: '0.0000',
                          unit: 'mm',
                        },
                        {
                          field: 'Phi_w',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'phi_IR',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'Chi',
                          value: '0.384',
                        },
                      ],
                      [
                        {
                          field: 'WK',
                          value: '8',
                        },
                        {
                          field: 'QR',
                          value: '1.58',
                          unit: 'N',
                        },
                        {
                          field: 'MR',
                          value: '0.000',
                          unit: 'N m',
                        },
                        {
                          field: 'Del',
                          value: '0.0000',
                          unit: 'mm',
                        },
                        {
                          field: 'Phi_w',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'phi_IR',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'Chi',
                          value: '0.384',
                        },
                      ],
                      [
                        {
                          field: 'WK',
                          value: '9',
                        },
                        {
                          field: 'QR',
                          value: '1.58',
                          unit: 'N',
                        },
                        {
                          field: 'MR',
                          value: '0.000',
                          unit: 'N m',
                        },
                        {
                          field: 'Del',
                          value: '0.0000',
                          unit: 'mm',
                        },
                        {
                          field: 'Phi_w',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'phi_IR',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'Chi',
                          value: '0.384',
                        },
                      ],
                      [
                        {
                          field: 'WK',
                          value: '10',
                        },
                        {
                          field: 'QR',
                          value: '1.58',
                          unit: 'N',
                        },
                        {
                          field: 'MR',
                          value: '0.000',
                          unit: 'N m',
                        },
                        {
                          field: 'Del',
                          value: '0.0000',
                          unit: 'mm',
                        },
                        {
                          field: 'Phi_w',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'phi_IR',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'Chi',
                          value: '0.384',
                        },
                      ],
                      [
                        {
                          field: 'WK',
                          value: '11',
                        },
                        {
                          field: 'QR',
                          value: '1.58',
                          unit: 'N',
                        },
                        {
                          field: 'MR',
                          value: '0.000',
                          unit: 'N m',
                        },
                        {
                          field: 'Del',
                          value: '0.0000',
                          unit: 'mm',
                        },
                        {
                          field: 'Phi_w',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'phi_IR',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'Chi',
                          value: '0.384',
                        },
                      ],
                      [
                        {
                          field: 'WK',
                          value: '12',
                        },
                        {
                          field: 'QR',
                          value: '1.58',
                          unit: 'N',
                        },
                        {
                          field: 'MR',
                          value: '0.000',
                          unit: 'N m',
                        },
                        {
                          field: 'Del',
                          value: '0.0000',
                          unit: 'mm',
                        },
                        {
                          field: 'Phi_w',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'phi_IR',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'Chi',
                          value: '0.384',
                        },
                      ],
                      [
                        {
                          field: 'WK',
                          value: '13',
                        },
                        {
                          field: 'QR',
                          value: '1.58',
                          unit: 'N',
                        },
                        {
                          field: 'MR',
                          value: '0.000',
                          unit: 'N m',
                        },
                        {
                          field: 'Del',
                          value: '0.0000',
                          unit: 'mm',
                        },
                        {
                          field: 'Phi_w',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'phi_IR',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'Chi',
                          value: '0.384',
                        },
                      ],
                      [
                        {
                          field: 'WK',
                          value: '14',
                        },
                        {
                          field: 'QR',
                          value: '1.58',
                          unit: 'N',
                        },
                        {
                          field: 'MR',
                          value: '0.000',
                          unit: 'N m',
                        },
                        {
                          field: 'Del',
                          value: '0.0000',
                          unit: 'mm',
                        },
                        {
                          field: 'Phi_w',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'phi_IR',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'Chi',
                          value: '0.384',
                        },
                      ],
                      [
                        {
                          field: 'WK',
                          value: '15',
                        },
                        {
                          field: 'QR',
                          value: '1.58',
                          unit: 'N',
                        },
                        {
                          field: 'MR',
                          value: '0.000',
                          unit: 'N m',
                        },
                        {
                          field: 'Del',
                          value: '0.0000',
                          unit: 'mm',
                        },
                        {
                          field: 'Phi_w',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'phi_IR',
                          value: '0.0000',
                          unit: 'mrad',
                        },
                        {
                          field: 'Chi',
                          value: '0.384',
                        },
                      ],
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          identifier: 'block',
          title: 'Ergebnisse Betriebsspiel',
          titleID: 'STRING_OUTP_RESULTS',
          subordinates: [
            {
              identifier: 'table',
              title: 'Geometrisches Betriebsspiel (Lagereinstellwerte)',
              titleID: 'STRING_OUTP_RESULTS',
              data: {
                fields: [
                  'Lastfall',
                  'sr_max_geo',
                  'sr_m_geo',
                  'sr_min_geo',
                  'sa_max_geo',
                  'sa_m_geo',
                  'sa_min_geo',
                ],
                unitFields: [
                  undefined,
                  {
                    unit: 'µm',
                  },
                  {
                    unit: 'µm',
                  },
                  {
                    unit: 'µm',
                  },
                  {
                    unit: 'µm',
                  },
                  {
                    unit: 'µm',
                  },
                  {
                    unit: 'µm',
                  },
                ],
                items: [
                  [
                    {
                      field: 'Lastfall',
                      value: 'Lastfall 1',
                    },
                    {
                      field: 'sr_max_geo',
                      value: '-37.3',
                      unit: 'µm',
                    },
                    {
                      field: 'sr_m_geo',
                      value: '-37.3',
                      unit: 'µm',
                    },
                    {
                      field: 'sr_min_geo',
                      value: '-37.3',
                      unit: 'µm',
                    },
                    {
                      field: 'sa_max_geo',
                      value: '-40.0',
                      unit: 'µm',
                    },
                    {
                      field: 'sa_m_geo',
                      value: '-40.0',
                      unit: 'µm',
                    },
                    {
                      field: 'sa_min_geo',
                      value: '-40.0',
                      unit: 'µm',
                    },
                  ],
                ],
              },
            },
          ],
        },
      ],
    },
    {
      identifier: 'block',
      title: 'Warnungen',
      subordinates: [
        {
          identifier: 'text',
          text: [' '],
        },
        {
          identifier: 'block',
          subordinates: [
            {
              identifier: 'text',
              text: [
                'Die Einstichbreite an den Borden ist undefined. Bitte Eingaben prüfen.',
              ],
            },
            {
              identifier: 'text',
              text: [' '],
            },
            {
              identifier: 'text',
              text: ['Beide Abmaße sind 0.'],
            },
            {
              identifier: 'text',
              text: [
                '  · Außenring 1: Oberes Abmaß am Sitz FO_Seat, Unteres Abmaß am Sitz FU_Seat',
              ],
            },
            {
              identifier: 'text',
              text: [
                '  · Gehäuse: Oberes Abmaß - Innendurchmesser FO_d, Unteres Abmaß - Innendurchmesser FU_d',
              ],
            },
            {
              identifier: 'text',
              text: [' '],
            },
            {
              identifier: 'text',
              text: [
                'Die berechnete Lebensdauer hängt von der Stellung der Wälzkörper ab. Eine stellungsunabhängige Rechnung wird empfohlen.',
              ],
            },
            {
              identifier: 'text',
              text: [' '],
            },
          ],
        },
      ],
    },
  ],
  companyInformation: [
    {
      url: 'http://www.schaeffler.com',
      company: 'www.schaeffler.com',
    },
  ],
  timeStamp: '2021-09-02 16:49:41',
  programVersion: '8.0',
  transactionFileName:
    'X:\\Alpha\\Bearinx\\Bearinx_rassaex_JSON_RESULT_AEAFW_2851\\ReferenceFiles\\Anstellung_SRoLa.vg2',
};
