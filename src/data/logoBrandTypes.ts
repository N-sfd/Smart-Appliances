export interface LogoBrand {
  name: string;
  displayName: string;
  logo: string;
}

export function resolveLogoBrands(
  names: string[],
  catalog: LogoBrand[],
): LogoBrand[] {
  return names.map((name) => {
    const match = catalog.find(
      (b) =>
        b.name.toLowerCase() === name.toLowerCase() ||
        b.displayName.toLowerCase() === name.toLowerCase(),
    );
    return match ?? { name, displayName: name, logo: '' };
  });
}
