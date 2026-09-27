import { Transform } from 'class-transformer';

export function TransformToStringArray() {
  return Transform(({ value }) => {
    switch (typeof value) {
      case 'string':
        return value.split(',').map((el) => el.trim());
      case 'number':
        return [String(value)];
      default:
        if (Array.isArray(value)) return value.map((el) => String(el).trim());
    }
    return [];
  });
}
