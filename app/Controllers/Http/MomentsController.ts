import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import { v4 as uuidv4 } from 'uuid'

import Moment from 'App/Models/Moment'

export default class MomentsController {
  private validatedOptions = {
    type: ['image'],
    size: '2mb',
  }
  public async store({ request, response }: HttpContextContract) {
    const body = request.body()
    const image = request.file('image', this.validatedOptions)

    if (image) {
      const imageName = `${uuidv4()}.${image.extname}`

      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })

      body.image = imageName
    }

    const moment = await Moment.create(body)

    response.status(201)

    return {
      msg: 'moment criado com sucesso',
      data: moment,
    }
  }
}
