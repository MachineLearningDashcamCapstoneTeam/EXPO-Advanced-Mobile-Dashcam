export const getListOfObjectWhereKeyContainsString = (listOfObjects, key, stringToSearchFor) => {
  const filteredList = listOfObjects.filter((object) => {
    const objectKey = object[key];
    return objectKey.includes(stringToSearchFor);
  });
  return filteredList;
};

export const getObjectsWhereKeyAnyValidStrings = (listOfObjects, key, arrayOfValidStrings) => {
  const filteredList = listOfObjects.filter((object) => {
    const objectKey = object[key];
    return arrayOfValidStrings.some((validString) => objectKey.includes(validString));
  });
  return filteredList;
};

export const getObjectsWhereKeyEqualsValue = (listOfObjects, key, value) => {
  const filteredList = listOfObjects.filter((object) => {
    const objectKey = object[key];
    return objectKey === value;
  });
  return filteredList;
};

export const checkIfElementExists = (listOfObjects, key, value) => {
  const filteredList = listOfObjects.filter((object) => {
    const objectKey = object[key];
    return objectKey === value;
  });

  if (filteredList.length >= 1) {
    return true;
  }

  return false;
};

export const removeObjectWhereValueEqualsString = (listOfObjects, key, value) => {
  const filteredList = listOfObjects.filter((object) => {
    const objectKey = object[key];
    return objectKey !== value;
  });
  return filteredList;
};
