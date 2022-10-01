// @TODO: It seems that SVG filters are pretty expensive for resvg, PNG
// generation time 10x'd when adding this filter (WASM in browser).
// https://drafts.fxtf.org/filter-effects/#feGaussianBlurElement

export default function shadow(
  { id, width, height }: { id: string; width: number; height: number },
  style: Record<string, any>
) {
  if (
    !style.shadowColor ||
    !style.shadowOffset ||
    typeof style.shadowRadius === 'undefined'
  ) {
    return ''
  }

  // console.log(style)

  // Expand the area for the filter to prevent it from cutting off.
  const grow = (style.shadowRadius * style.shadowRadius) / 4

  const left = Math.min(style.shadowOffset.width - grow, 0)
  const right = Math.max(style.shadowOffset.width + grow + width, width)
  const top = Math.min(style.shadowOffset.height - grow, 0)
  const bottom = Math.max(style.shadowOffset.height + grow + height, height)

  return `<defs><filter id="satori_s-${id}" x="${(left / width) * 100}%" y="${
    (top / height) * 100
  }%" width="${((right - left) / width) * 100}%" height="${
    ((bottom - top) / height) * 100
  }%"><feDropShadow dx="${style.shadowOffset.width}" dy="${
    style.shadowOffset.height
  }" stdDeviation="${
    // According to the spec, we use the half of the blur radius as the standard
    // deviation for the filter.
    // > the image that would be generated by applying to the shadow a Gaussian
    // > blur with a standard deviation equal to half the blur radius
    // > https://www.w3.org/TR/css-backgrounds-3/#shadow-blur
    style.shadowRadius / 2
  }" flood-color="${style.shadowColor}" flood-opacity="1"/></filter></defs>`
}
