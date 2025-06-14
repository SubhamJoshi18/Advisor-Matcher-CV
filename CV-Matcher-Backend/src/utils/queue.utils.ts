import { IFileContent } from "../interface/file.interface";

const prepareQueuePayloadForValidation = (content: IFileContent) => {
  const payload = {
    name: content.filename,
    size: content.size,
    mimeType: content.mimetype,
    originalName: content.originalname,
  } as any;

  return payload;
};

export { prepareQueuePayloadForValidation };
