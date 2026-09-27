import { Transform } from 'class-transformer';

export function TransformToNumberArray() {
  return Transform(({ value }) => {
    switch (typeof value) {
      case 'string':
        return value.split(',').map((el) => parseInt(el.trim(), 10));
      case 'number':
        return [value];
      default:
        if (Array.isArray(value))
          return value.map((el) => parseInt(el.trim(), 10));
    }
    return [];
  });
}
