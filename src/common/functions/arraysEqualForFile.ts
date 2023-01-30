export const arraysEqualForFile = (arr1: any[], arr2: any[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].id !== arr2[i].id) {
      return false;
    }

    if (arr1[i].key !== arr2[i].key) {
      return false;
    }
  }

  return true;
};
