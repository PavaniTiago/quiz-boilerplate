import { Question } from '@/types/types'
import React from 'react'

interface Props {
  question: Question
  onAnswerSelected: (nextId: string | null) => void
}

const QuizQuestion: React.FC<Props> = ({ question, onAnswerSelected }) => {
  return (
    <div className="w-full max-w-lg">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-green-400">
          {question.title}
        </h2>
        {question.subtitle && (
          <p className="text-gray-400">{question.subtitle}</p>
        )}
      </div>
      <div className="space-y-4">
        {question.options.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-center space-x-4 rounded-lg bg-gray-700 p-4"
          >
            <input
              type="radio"
              name={question.id}
              value={option.id}
              onChange={() => onAnswerSelected(option.next)}
              className="size-6 border-gray-600 text-green-400 focus:ring-green-400"
            />
            <span className="text-gray-300">{option.text}</span>
          </label>
        ))}
      </div>
      {question.tooltip && (
        <div className="mt-6 rounded-lg bg-gray-800 p-4">
          <div className="flex items-center">
            <svg
              className="mr-2 size-4 text-gray-400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0"
                y="0"
                width="16"
                height="16"
                rx="4"
                fill="currentColor"
              />
              <path
                d="M6.751 9.758v-.433c0-.375.08-.702.24-.979.16-.277.453-.572.88-.885.41-.293.679-.531.808-.715.133-.183.199-.388.199-.615 0-.254-.094-.447-.281-.58-.188-.133-.45-.2-.785-.2-.586 0-1.254.192-2.004.575l-.639-1.283a5.583 5.583 0 0 1 2.772-.732c.804 0 1.443.193 1.916.58.476.386.714.902.714 1.546 0 .43-.097.801-.293 1.114-.195.312-.566.664-1.113 1.054-.375.278-.613.489-.715.633-.097.145-.146.334-.146.569v.351H6.75Zm-.187 2.004c0-.328.087-.576.263-.744.176-.168.432-.252.768-.252.324 0 .574.086.75.258.18.172.27.418.27.738 0 .309-.09.553-.27.732-.18.176-.43.264-.75.264-.328 0-.582-.086-.762-.258-.18-.175-.27-.421-.27-.738Z"
                fill="#fff"
              />
            </svg>
            <p className="text-sm text-gray-400">{question.tooltip.title}</p>
          </div>
          <p className="mt-2 text-gray-300">{question.tooltip.description}</p>
        </div>
      )}
    </div>
  )
}

export default QuizQuestion
