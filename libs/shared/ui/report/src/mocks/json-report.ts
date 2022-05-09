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
