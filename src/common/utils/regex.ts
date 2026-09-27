export const normilizedSql = (field: unknown) => {
  switch (typeof field) {
    case 'string':
      return field.replace(/[%_\\]/g, '\\$&');
    case 'undefined':
      return undefined;
  }
};
