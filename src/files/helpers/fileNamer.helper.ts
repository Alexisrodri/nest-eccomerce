import { v4 as uuid } from 'uuid';

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
  // console.log({ file });
  if (!file) return callback(new Error(`File is Empty`), false)
  const fileExt = file.mimetype.split('/')[1];
  const filename = `${uuid()}.${fileExt}`
  callback(null, filename)
}