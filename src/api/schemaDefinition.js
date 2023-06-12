import dayjs from "dayjs";

export const stringField = () => ({
  toJS: (x) => x,
  toJSON: (x) => x,
});

export const dateField = () => ({
  toJS: (ISOString) => ISOString && dayjs(ISOString),
  toJSON: (date) => date && date.toJSON(),
});

export const arrayField = (nestedType) => ({
  toJS: (JSONarray) => JSONarray && JSONarray.map(nestedType.toJS),
  toJSON: (objArray) => objArray && objArray.map(nestedType.toJSON),
});

export const objectField = (schema) => ({
  toJS: (json) => {
    const obj = Object.fromEntries(
      Object.entries(schema).map(([key, value]) => [key, value.toJS(json[key])])
    );
    obj.key = obj.id;
    return obj;
  },
  toJSON: (json) =>
    Object.fromEntries(
      Object.entries(schema).map(([key, value]) => [
        key,
        value.toJSON(json[key]),
      ])
    ),
});
