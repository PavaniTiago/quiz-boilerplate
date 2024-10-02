import React from 'react'

interface Props {
  currentIndex: number
  totalQuestions: number
}

const ProgressBar: React.FC<Props> = ({ currentIndex, totalQuestions }) => {
  const progressPercentage = Math.min(
    ((currentIndex + 1) / totalQuestions) * 100,
    100,
  )

  return (
    <div className="h-2 w-full overflow-hidden rounded-lg bg-green-900">
      <div
        className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  )
}

export default ProgressBar
