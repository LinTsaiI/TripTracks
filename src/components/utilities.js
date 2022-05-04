import { useEffect, useRef } from "react"

export const getCurrentDate = () => {
  let today = new Date();
  let yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  (mm < 10) ? mm = '0' + mm : mm;
  (dd < 10) ? dd = '0' + dd : dd;
  let date = yyyy + '-' + mm + '-' + dd;
  return date;
}

export const useUpdateEffect = (callback, dependencies) => {
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    return callback()
  }, dependencies);
}