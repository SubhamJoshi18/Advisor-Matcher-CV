import fileContent from "../constant/file.constant";

const checkKeyAndRetrieve = (object: object | any, key: string) => {
  return Object.prototype.hasOwnProperty.call(object, key) ? object[key] : null;
};

const objectReplace = (obj: object) => {
  let responseObject = {} as any;
  for (const [key, value] of Object.entries(obj)) {
    if (!Object.prototype.hasOwnProperty.call(responseObject, key)) {
      responseObject[key] = value;
    }
  }
  return responseObject;
};

export { checkKeyAndRetrieve, objectReplace };
