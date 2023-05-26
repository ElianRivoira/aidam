export const setCanvasWidth = (ref: string, screenWidth: number | undefined) => {
  let width = 0;
  if (ref === 'croquisRef') {
    if (screenWidth) {
      if (screenWidth > 700) width = 562;
      else if (screenWidth > 464) width = 400;
      else width = 295;
    }
  } else if (ref === 'linkageNetMapRef') {
    if (screenWidth) {
      if (screenWidth > 700) width = 600;
      else if (screenWidth > 464) width = 400;
      else width = 296;
    }
  } else if (ref === 'firmaRef') {
    if (screenWidth) {
      if (screenWidth > 464) width = 400;
      else width = 336;
    }
  }
  return width;
};

export const setCanvasHeight = (ref: string, screenWidth: number | undefined) => {
  let height = 0;
  if (ref === 'croquisRef') {
    if (screenWidth) {
      if (screenWidth > 700) height = 179;
      else if (screenWidth > 464) height = 130;
      else height = 94;
    }
  } else if (ref === 'linkageNetMapRef') {
    if (screenWidth) {
      if (screenWidth > 700) height = 595;
      else if (screenWidth > 464) height = 400;
      else height = 293;
    }
  } else if (ref === 'firmaRef') {
    if (screenWidth) {
      if (screenWidth > 464) height = 200;
      else height = 200;
    }
  }
  return height;
};