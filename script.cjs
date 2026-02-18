
const xlsx = require('xlsx')
const { ComponentType } = require('@defra/forms-model')
const workbook = xlsx.utils.book_new()
const contentTypes = [
  ComponentType.Details,
  ComponentType.Html,
  ComponentType.Markdown,
  ComponentType.InsetText,
  ComponentType.List
]
const files = [
  ['Ask Natural England', './ask-natural-england-a-question-or-get-advice-related-to-protected-sites.json'],
  ['Give notice and get assent', './give-notice-and-get-assent-for-a-planned-activity-on-or-near-a-sssi.json'],
  ['Give notice and get consent', './give-notice-and-get-consent-for-a-planned-activity-on-a-sssi.json']
]
const defs = files.map(f => require(f[1]))

const dataTypes = {
  [ComponentType.TextField]: 'string',
  [ComponentType.MultilineTextField]: 'string',
  [ComponentType.YesNoField]: 'boolean',
  [ComponentType.DatePartsField]: 'date',
  [ComponentType.MonthYearField]: 'string',
  [ComponentType.SelectField]: 'string',
  [ComponentType.AutocompleteField]: 'string',
  [ComponentType.RadiosField]: 'string',
  [ComponentType.CheckboxesField]: 'string',
  [ComponentType.NumberField]: 'number',
  [ComponentType.UkAddressField]: 'object',
  [ComponentType.TelephoneNumberField]: 'string',
  [ComponentType.EmailAddressField]: 'string',
  [ComponentType.FileUploadField]: 'object',
  [ComponentType.DeclarationField]: 'boolean',
  [ComponentType.EastingNorthingField]: 'object',
  [ComponentType.OsGridRefField]: 'string',
  [ComponentType.NationalGridFieldNumberField]: 'string',
  [ComponentType.LatLongField]: 'object',
  [ComponentType.HiddenField]: 'string',
  [ComponentType.PaymentField]: 'string',
}
const wsHeaders = ['Question title', 'Short description', 'Type', 'Data type', 'Component required', 'Page is conditional', 'Required']

defs.forEach((def, i) => {
  const wsRows = []
  def.pages.forEach(p => {
    const formComponents = p.components?.filter(c => !contentTypes.includes(c.type)) ?? []
    if (formComponents.length) {
      formComponents.forEach(c => {
        const required = p.condition ? false : c.options.required
        wsRows.push([c.title, c.shortDescription, c.type, dataTypes[c.type], c.options.required, !!p.condition, required])
      })
    }
  })

  const worksheet = xlsx.utils.aoa_to_sheet([wsHeaders, ...wsRows])
  xlsx.utils.book_append_sheet(workbook, worksheet, files[i][0])
})

xlsx.writeFile(workbook, 'workbook.xlsx')
