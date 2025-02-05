import { Transformation } from '@cloudinary/url-gen'
import { edit } from '@cloudinary/url-gen/actions/animated'
import { ifCondition } from '@cloudinary/url-gen/actions/conditional'
import { quality } from '@cloudinary/url-gen/actions/delivery'
import { fill, scale } from '@cloudinary/url-gen/actions/resize'
import { toAnimated } from '@cloudinary/url-gen/actions/transcode'

import { cld } from '../pages/_app'

type Metadata =
  | {
      public_id: string
      resource_type: string
    }
  | undefined

export function isMediaVideo(metadata: Metadata) {
  return metadata?.resource_type == 'video'
}

export function getOptimizedMedia({
  metadata,
  width,
  height,
  asImage = false,
}: {
  metadata: {
    public_id: string
    resource_type: string
  }
  width?: number
  height?: number
  asImage?: boolean
}) {
  if (isMediaVideo(metadata) && asImage) {
    return cld
      .video(metadata.public_id)
      .resize(scale().height(240))
      .animated(edit().loop())
      .transcode(toAnimated().sampling(40))
      .animated(edit().delay(200))
      .format('gif')
      .delivery(quality(50))
      .toURL()
  }

  if (isMediaVideo(metadata)) {
    return cld
      .video(metadata.public_id)
      .format('webm')
      .conditional(ifCondition('height > 1280', new Transformation().resize(fill().height('1280'))))
      .delivery(quality(50))
      .toURL()
  } else {
    if (height && width) {
      return cld
        .image(metadata.public_id)
        .format('jpg')
        .resize(fill().width(width).height(height))
        .delivery(quality(50))
        .toURL()
    }

    if (height) {
      return cld.image(metadata.public_id).format('jpg').resize(fill().height(height)).delivery(quality(50)).toURL()
    }

    if (width) {
      return cld.image(metadata.public_id).format('jpg').resize(fill().width(width)).delivery(quality(50)).toURL()
    }

    return cld
      .image(metadata.public_id)
      .format('jpg')
      .conditional(ifCondition('height > 1280', new Transformation().resize(fill().height('1280'))))
      .delivery(quality(50))
      .toURL()
  }
}
