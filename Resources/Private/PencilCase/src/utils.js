export const getClasses = (attributes) => {
  if (!attributes?.class) {
    return undefined;
  }

  if (Array.isArray(attributes.class)) {
    return attributes.class;
  }

  return [attributes.class];
};

export const getStyles = (attributes) => {
  if (!attributes?.style || typeof attributes.style !== "object") {
    return undefined;
  }

  return attributes.style;
};

export const getAttributes = (attributes) => {
  if (!attributes) {
    return undefined;
  }

  const _attributes = { ...attributes };
  delete _attributes.class;
  delete _attributes.style;

  return _attributes;
};
