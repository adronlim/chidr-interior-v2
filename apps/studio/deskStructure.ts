import type { StructureBuilder, StructureResolver } from 'sanity/structure';

export const deskStructure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Company info')
        .id('company')
        .child(S.document().schemaType('company').documentId('company')),
      S.listItem()
        .title('Homepage hero')
        .id('hero')
        .child(S.document().schemaType('hero').documentId('hero')),
      S.divider(),
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('projectCategory').title('Categories'),
      S.documentTypeListItem('teamMember').title('Team'),
      S.divider(),
      S.documentTypeListItem('inquiry').title('Inquiries (contact form)'),
    ]);
