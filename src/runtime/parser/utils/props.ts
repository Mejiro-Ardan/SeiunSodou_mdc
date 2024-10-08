export const unsafeLinkPrefix = [
  'javascript:',
  'data:text/html',
  'vbscript:',
  'data:text/javascript',
  'data:text/vbscript',
  'data:text/css',
  'data:text/plain',
  'data:text/xml'
]

export const validateProp = (attribute: string, value: string) => {
  if (attribute.startsWith('on')) {
    return false
  }

  if (attribute === 'href' || attribute === 'src') {
    return !unsafeLinkPrefix.some(prefix => value.toLowerCase().startsWith(prefix))
  }

  return true
}

export const validateProps = (type: string, props?: Record<string, any>) => {
  if (!props) {
    return {}
  }
  props = Object.fromEntries(
    Object.entries(props).filter(([name, value]) => {
      const isValid = validateProp(name, value)

      if (!isValid) {
        console.warn(`[seiunsodou_mdc] removing unsafe attribute: ${name}="${value}"`)
      }

      return isValid
    })
  )

  if (type === 'pre') {
    if (typeof props.highlights === 'string') {
      props.highlights = props.highlights.split(' ').map(i => Number.parseInt(i))
    }
  }

  return props
}
