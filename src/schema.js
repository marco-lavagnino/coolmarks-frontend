import {
  stringField,
  dateField,
  arrayField,
  objectField,
} from "./api/schemaDefinition.js";

export const linkSchema = objectField({
  id: stringField(),
  tags: arrayField(stringField()),
  dt: dateField(),
  location: stringField(),
  domain: stringField(),
  title: stringField(),
  owner: stringField(),
});
