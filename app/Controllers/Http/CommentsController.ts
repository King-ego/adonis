import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Comment from 'App/Models/Comment'
import Moment from 'App/Models/Moment'

export default class CommentsController {
  public async store({ request, response, params }: HttpContextContract) {
    const body = request.body()
    const momentId = params.momentsId

    await Moment.findOrFail(momentId)

    body.momentId = momentId

    const comment = await Comment.create(body)
    response.status(201)
    return {
      message: 'comentario criado com sucesso',
      data: comment,
    }
  }

  public async index({ params }: HttpContextContract) {
    let message = 'Não Encontrado'

    const momentId = params.momentsId

    await Moment.findOrFail(momentId)

    const comment = await Comment.all()

    const filter = comment.filter((e) => e.$attributes.momentId === Number(momentId))

    if (filter.length) {
      message = 'Encontrado'
    }

    return {
      message,
      data: filter,
    }
  }

  public async show({}: HttpContextContract) {}

  public async destroy({ params }: HttpContextContract) {
    const comment = await Comment.findOrFail(params.id)

    await comment.delete()

    return {
      message: 'comentario excluido com sucesso',
      data: comment,
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const comment = await Comment.findOrFail(params.id)
    const body = request.body()

    comment.username = body.username
    comment.text = body.text

    await comment.save()

    return {
      message: 'comentario atualizado com sucesso',
      data: comment,
    }
  }
}
