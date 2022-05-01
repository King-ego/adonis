import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import { v4 as uuidv4 } from 'uuid'

import Moment from 'App/Models/Moment'

export default class MomentsController {
  private validatedOptions = {
    type: ['image'],
    extnames: ['jpg', 'png', 'gif'],
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

  public async index() {
    const moments = await Moment.query().preload('comments')

    return {
      data: moments,
    }
  }

  public async show({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)

    await moment.load('comments')

    return {
      data: moment,
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const moments = await Moment.findOrFail(params.id)

    await moments.delete()

    return {
      message: 'momento excluido com sucesso',
      data: moments,
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const moments = await Moment.findOrFail(params.id)
    const body = request.body()

    moments.title = body.title
    moments.description = body.description

    if (moments.image !== body.image || !moments.image) {
      const image = request.file('image', this.validatedOptions)

      if (image) {
        const imageName = `${uuidv4()}.${image.extname}`

        await image.move(Application.tmpPath('uploads'), {
          name: imageName,
        })

        moments.image = imageName
      }
    }
    await moments.save()

    return {
      message: 'momento atualizado com sucesso',
      data: moments,
    }
  }
}
