import OkIni from 'main/lib/ok-ini';

describe('ok-ini', () => {
  describe('render as ini', () => {
    it('renders root properties', () => {
      const ini = new OkIni();
      ini.addTopLevel({ a: 1 });
      ini.addTopLevel({ A: 1 });

      expect(ini.render().trim()).toEqual(`a=1\nA=1`);
    });

    it('throws if root properties are duplicate', () => {
      const ini = new OkIni({ disallowDuplicateEntries: true });
      ini.addTopLevel({ a: 1 });

      expect(() => ini.addTopLevel({ A: 1 })).toThrow(/duplicate/);
    });

    it('renders sections', () => {
      const ini = new OkIni();
      const name = 'section';
      ini.add({ name, contents: { a: 1, b: 2 } });
      ini.add({ name, contents: { c: 3, d: 4 } });

      expect(ini.render().trim()).toEqual(
        `[${name}]\na=1\nb=2\n\n[${name}]\nc=3\nd=4`
      );
    });

    it('throws if sections are duplicate', () => {
      const ini = new OkIni({ disallowDuplicateSections: true });
      const name = 'section';
      ini.add({ name, contents: { a: 1, b: 2 } });

      expect(() => ini.add({ name, contents: { c: 3, d: 4 } })).toThrow(
        /duplicate/
      );
    });
  });

  describe('import ini', () => {
    it('imports valid root properties', () => {
      const ini = new OkIni();
      const config = `
      foo=2
      bar=3
      baz
      `;

      ini.fromIni(config);
      expect(ini.dump()).toEqual({
        root: [{ foo: 2, bar: 3 }],
        sections: [],
      });
    });

    it('imports mix of root properties and sections', () => {
      const ini = new OkIni();
      const config = `
      foo=2
      bar=3
      
      [section1 ]
      foo                    = 4
      bar="[aaaa]a"
      baz
      
      [                section2 ]
      aaa
      bar = '=lakjsdlkjasdlk'
      
      `;

      ini.fromIni(config);
      expect(ini.dump()).toEqual({
        root: [{ foo: 2, bar: 3 }],
        sections: [
          { name: 'section1', contents: { foo: 4, bar: '[aaaa]a' } },
          { name: 'section2', contents: { bar: '=lakjsdlkjasdlk' } },
        ],
      });
    });

    it('imports only sections', () => {
      const ini = new OkIni();
      const config = `
      [section1 ]
      foo                    = 4
      bar="[aaa=a]=a"
      baz
      
      [                section233333333333 asd asd  ]
      aaa
      bar = '=lakjsdlkjasdlk'
      
      `;

      ini.fromIni(config);
      expect(ini.dump()).toEqual({
        root: [{}],
        sections: [
          { name: 'section1', contents: { foo: 4, bar: '[aaa=a]=a' } },
          {
            name: 'section233333333333 asd asd',
            contents: { bar: "=lakjsdlkjasdlk" },
          },
        ],
      });
    });

    it('imports duplicate sections', () => {
      const ini = new OkIni();
      const config = `
[variable]
name='v0'
value='new'

[variable]
name='v1'
value='new'

[variable]
name='v2'
value='new'

      `;

      ini.fromIni(config);
      expect(ini.dump()).toEqual({
        root: [{}],
        sections: [
          { name: 'variable', contents: { name: 'v0', value: 'new' } },
          { name: 'variable', contents: { name: 'v1', value: 'new' } },
          { name: 'variable', contents: { name: 'v2', value: 'new' } },
        ],
      });
    });

    it('imports different duplicate sections', () => {
      const ini = new OkIni();
      const config = `
[variable]
name='v0'
value='new'

[variable]
name='v1'
value='new'

[variable]
name='v2'
value='new'

[text]
text=[context.v0]
id=0

[text]
text=[context.v1]
id=1

      `;

      ini.fromIni(config);
      expect(ini.dump()).toEqual({
        root: [{}],
        sections: [
          { name: 'variable', contents: { name: 'v0', value: 'new' } },
          { name: 'variable', contents: { name: 'v1', value: 'new' } },
          { name: 'variable', contents: { name: 'v2', value: 'new' } },
          { name: 'text', contents: { text: '[context.v0]', id: 0 } },
          { name: 'text', contents: { text: '[context.v1]', id: 1 } },
        ],
      });
    });

    it('imports sections and keeps quotes', () => {
      const ini = new OkIni({ keepQuotedStrings: true });
      const config = `
[variable]
name='v0'
value='new'

[text]
text=[context.v1]

      `;

      ini.fromIni(config);
      expect(ini.dump()).toEqual({
        root: [{}],
        sections: [
          { name: 'variable', contents: { name: "'v0'", value: "'new'" } },
          { name: 'text', contents: { text: '[context.v1]' } },
        ],
      });
    });
  });
});
