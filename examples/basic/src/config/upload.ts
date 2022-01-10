import multer from '@koa/multer'
import { pseudoRandomBytes } from 'crypto'
import fs from 'fs'
import path from 'path'
import dayjs from 'dayjs'

const storage = multer.diskStorage({
  destination: 'uploads',
  filename(_, file, cb) {
    pseudoRandomBytes(16, (err, raw) => {
      const date = dayjs().format('YYYY-MM-DD')
      const folder = path.resolve(__dirname, `../../uploads/${date}`)
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder)
      }

      try {
        cb(
          err,
          `${date}/${raw.toString('hex')}${file.originalname.substring(
            file.originalname.lastIndexOf('.')
          )}`
        )
      } catch (error: any) {
        cb(error, `${date}/${Date.now().toString()}-${file.originalname}`)
      }
    })
  },
})

export const uploadConfig = {
  dest: 'uploads',
  storage,
}
