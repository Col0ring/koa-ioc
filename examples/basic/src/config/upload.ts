import multer from '@koa/multer'
import { pseudoRandomBytes } from 'crypto'
import dayjs from 'dayjs'

const storage = multer.diskStorage({
  destination: `uploads/${dayjs().format('YYYY-MM-DD')}`,
  filename(_, file, cb) {
    pseudoRandomBytes(16, (err, raw) => {
      try {
        cb(
          err,
          raw.toString('hex') +
            file.originalname.substring(file.originalname.lastIndexOf('.'))
        )
      } catch (error: any) {
        cb(error, Date.now().toString() + '-' + file.originalname)
      }
    })
  },
})

export const uploadConfig = {
  dest: 'uploads',
  storage,
}
