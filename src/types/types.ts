export interface Option {
  id: string
  text: string
  next: string | null
}

export interface Tooltip {
  title: string
  description: string
}

export interface Question {
  id: string
  title: string
  subtitle?: string
  options: Option[]
  tooltip?: Tooltip
}
