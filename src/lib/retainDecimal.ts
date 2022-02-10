function retainDecimal(value: number): string
function retainDecimal(value: string): string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function retainDecimal(value: any): any {
  let result
  if (typeof value === 'number') {
    result = value.toFixed(2)
  } else if (typeof value === 'string') {
    result = parseFloat(value).toFixed(2)
  }
  return result
}

export default retainDecimal
