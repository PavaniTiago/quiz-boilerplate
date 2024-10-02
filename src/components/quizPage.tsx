import { useState } from 'react'
import { Question } from '@/types/types'
import ProgressBar from './progressBar'
import QuizQuestion from './quizQuestion'

const quizData: Question[] = [
  {
    id: 'question1',
    title: 'Você já faz day trade?',
    subtitle: 'Por favor, selecione apenas uma das opções.',
    options: [
      { id: 'sim', text: 'Sim', next: 'question2' },
      { id: 'nao', text: 'Não', next: 'question3' },
    ],
  },
  {
    id: 'question2',
    title: 'Quanto tempo de experiência você tem?',
    subtitle: 'Por favor, selecione apenas uma das opções.',
    options: [
      { id: 'Menos-de-6-meses', text: 'Menos de 6 meses', next: 'question4' },
      { id: 'De-6-a-12-meses', text: 'De 6 a 12 meses', next: 'question4' },
      { id: 'De-1-a-3-anos', text: 'De 1 a 3 anos', next: 'question4' },
      { id: 'Mais-de-5-anos', text: 'Mais de 5 anos', next: 'question4' },
    ],
    tooltip: {
      title: 'Por que esta pergunta é feita?',
      description:
        'Ao compreendermos o seu tempo de experiência, conseguimos ter uma perspectiva melhor da sua realidade atual.',
    },
  },
  // Add more questions as needed
]

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [history, setHistory] = useState<number[]>([])

  const handleAnswerSelected = (nextId: string | null) => {
    const nextQuestionIndex = quizData.findIndex((q) => q.id === nextId)
    if (nextQuestionIndex >= 0) {
      setHistory([...history, currentQuestionIndex])
      setCurrentQuestionIndex(nextQuestionIndex)
    } else {
      alert('Você concluiu o quiz!')
    }
  }

  const handleBackButton = () => {
    if (history.length > 0) {
      const previousQuestionIndex = history.pop()!
      setCurrentQuestionIndex(previousQuestionIndex)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <nav className="flex w-full items-center justify-between bg-gray-800 px-6 py-4">
        <button
          onClick={handleBackButton}
          className={`flex items-center text-gray-400 ${history.length === 0 ? 'hidden' : ''}`}
        >
          <svg
            className="mr-2 size-4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.75 16.5L1.25 9L8.75 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Voltar
        </button>
        <div className="flex justify-center">
          <ProgressBar
            currentIndex={currentQuestionIndex}
            totalQuestions={quizData.length}
          />
        </div>
      </nav>
      <main className="flex grow flex-col items-center justify-center p-6">
        <QuizQuestion
          question={quizData[currentQuestionIndex]}
          onAnswerSelected={handleAnswerSelected}
        />
      </main>
      <footer className="w-full bg-gray-800 py-4 text-center text-sm text-gray-500">
        <div>© 2024 M3SA</div>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="#" className="hover:underline">
            Política de Privacidade
          </a>
          <a href="#" className="hover:underline">
            Termos de Serviço
          </a>
        </div>
      </footer>
    </div>
  )
}

export default QuizPage
