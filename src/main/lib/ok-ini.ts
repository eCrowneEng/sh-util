/* eslint-disable max-classes-per-file */
export interface Config {
  disallowDuplicateSections?: Boolean;
  disallowDuplicateEntries?: Boolean;
  keepQuotedStrings?: Boolean;
}

const rootSectionName = '__ROOT';

export type Properties = { [key: string]: string | number };

export interface Section {
  name: string;
  contents: Properties;
}

export interface IniContents {
  root: Array<Properties>;
  sections: Array<Section>;
}

export class DuplicateEntryError extends Error {}

/**
 * A library that does an OK job handling ini.. meaning, it likely misses
 *  a lot of proper cases and just works for its limited use-case
 */
export default class OkIni {
  config: Config;

  private sections: Array<Section> = [];

  private sectionNames: Set<string> = new Set();

  private rootSection: Array<Properties> = [];

  private rootProperties: Set<string> = new Set();

  constructor(config?: Config) {
    this.config = config ?? {};
  }

  /**
   * Parse an ini from content string to hydrate the internal state
   */
  fromIni(iniContents: string) {
    const lines = iniContents.trim().split('\n');
    let sectionName = rootSectionName;
    let properties: Properties = {};
    lines.forEach((line) => {
      const processedLine = line.trim();
      if (processedLine.trim() === '') {
        return;
      }
      const sectionMatches = processedLine.match(/^\s?\[(?<sectionName>.*)\]/i);
      if (sectionMatches?.groups?.sectionName) {
        const prevSection = sectionName;
        const matchedSectionName = sectionMatches?.groups?.sectionName.trim();
        sectionName = matchedSectionName ?? rootSectionName;
        this.addPropertiesToSection(prevSection, properties);
        properties = {};
      } else {
        const data = processedLine.split(/=(.*)/s);
        if (data.length > 2) {
          const key = data[0].trim();
          let value: number | string = data[1].trim();
          if (!Number.isNaN(Number(value))) {
            value = Number(value);
          } else if (OkIni.isQuoted(value)) {
            if (this.config.keepQuotedStrings !== true) {
              value = value.slice(1, -1);
            }
          }
          properties[key] = value;
        }
      }
    });
    if (Object.keys(properties).length) {
      this.addPropertiesToSection(sectionName, properties);
    }
  }

  /**
   * Add a single section of data
   */
  add(section: Section) {
    const caseInsensitiveName = section.name.toLocaleLowerCase();
    const isDuplicate = this.sectionNames.has(caseInsensitiveName);
    if (isDuplicate && this.config.disallowDuplicateSections) {
      throw new DuplicateEntryError(`duplicate entry ${caseInsensitiveName}`);
    }
    this.sections.push({ ...section, name: caseInsensitiveName });
    this.sectionNames.add(caseInsensitiveName);
  }

  /**
   * Add properties to the root unnamed section
   */
  addTopLevel(properties: Properties) {
    if (this.config.disallowDuplicateEntries) {
      const duplicates = Object.keys(properties).filter((key) =>
        this.rootProperties.has(key.toLocaleLowerCase())
      );
      if (duplicates.length > 0) {
        throw new DuplicateEntryError(
          `duplicate entries ${duplicates.join(', ')}`
        );
      }
    }
    this.rootSection.push(properties);
    Object.entries(properties).forEach((entry) => {
      this.rootProperties.add(entry[0].toLocaleLowerCase());
    });
  }

  /**
   * Return the internal state required to process an ini
   */
  dump(): IniContents {
    return {
      root: this.rootSection,
      sections: this.sections,
    };
  }

  /**
   * Make an ini string (probably to be saved to a file)
   */
  render(): string {
    const buffer: Array<string> = [];
    this.rootSection.forEach((properties) => {
      buffer.push(...OkIni.entriesFromProperties(properties));
    });

    this.sections.forEach((section, i) => {
      const { name, contents } = section;
      if (i > 0) {
        buffer.push('');
      }
      buffer.push(`[${name}]`);
      buffer.push(...OkIni.entriesFromProperties(contents));
    });
    buffer.push('');
    return buffer.join('\n');
  }

  private addPropertiesToSection(sectionName: string, properties: Properties) {
    if (sectionName !== rootSectionName) {
      const section: Section = {
        name: sectionName,
        contents: properties,
      };
      this.add(section);
    } else {
      this.addTopLevel(properties);
    }
  }

  static isQuoted(val: string): boolean {
    return (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    );
  }

  static entriesFromProperties(properties: Properties): Array<string> {
    const buffer: Array<string> = [];
    Object.entries(properties).forEach((entry) => {
      const [key, value] = entry;
      buffer.push(`${key}=${value}`);
    });
    return buffer;
  }
}
