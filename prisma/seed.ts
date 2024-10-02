// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client')
// import { hash } from 'bcrypt-ts'

const prisma = new PrismaClient()

async function main() {
  // Create a quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: 'General Knowledge Quiz',
      description: 'Test your general knowledge with this fun quiz!',
      questions: {
        create: [
          {
            text: 'What is the capital of France?',
            title: 'Capital Cities',
            description: 'Identify the capital city of France.',
            type: 'SINGLE_CHOICE',
            answers: {
              create: [
                { text: 'Paris', isCorrect: true },
                { text: 'London', isCorrect: false },
                { text: 'Berlin', isCorrect: false },
                { text: 'Madrid', isCorrect: false },
              ],
            },
          },
          {
            text: 'What is 2 + 2?',
            title: 'Simple Math',
            description: 'Solve this basic math problem.',
            type: 'SINGLE_CHOICE',
            answers: {
              create: [
                { text: '3', isCorrect: false },
                { text: '4', isCorrect: true },
                { text: '5', isCorrect: false },
              ],
            },
          },
          // Add more questions as needed
        ],
      },
    },
  })

  // Create an anonymous session for the user entering the quiz
  const session = await prisma.session.create({
    data: {
      sessionToken: 'anonymous-session-token',
      user: {
        create: {
          email: null,
          password: null,
          name: 'Anonymous',
        },
      },
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour expiry
    },
  })

  // Create a quiz session for the anonymous user
  const quizSession = await prisma.quizSession.create({
    data: {
      userId: session.userId,
      quizId: quiz.id,
      currentQuestionIndex: 0,
      progress: 0,
      isCompleted: false,
    },
  })

  console.log('Seed data created:')
  console.log('Quiz:', quiz)
  console.log('Session:', session)
  console.log('QuizSession:', quizSession)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
