import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Learnly database...');

  // Clean existing seed data
  await prisma.quizQuestion.deleteMany();
  await prisma.segment.deleteMany();
  await prisma.flashcard.deleteMany();
  await prisma.userVideoProgress.deleteMany();
  await prisma.task.deleteMany();
  await prisma.attentionEvent.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.video.deleteMany();

  // Video 1: Neural Networks
  const v1 = await prisma.video.create({
    data: {
      youtube_video_id: 'aircAruvnKk',
      title: 'But what is a neural network? | Deep learning, chapter 1',
      channel: '3Blue1Brown',
      duration_seconds: 1152,
      thumbnail_url: 'https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg',
      status: 'ready',
      segments: {
        create: [
          {
            order_index: 0,
            title: '1. What are Neurons & Activations?',
            summary: 'Understanding artificial neurons as numbers holding activations between 0 and 1.',
            start_seconds: 0,
            end_seconds: 300,
            quiz_questions: {
              create: [
                {
                  question: 'In the context of the digit recognition network, what does the activation of a neuron represent?',
                  options: JSON.stringify([
                    'A number typically between 0 and 1 representing grayscale intensity or feature presence',
                    'The physical voltage of the computer CPU cache',
                    'A binary flag that can only be 0 or 1 with no decimal values',
                    'The memory address of the input image pixel',
                  ]),
                  correct_answer: 'A number typically between 0 and 1 representing grayscale intensity or feature presence',
                  explanation: 'Activations in the first layer represent pixel values between 0 and 1, and hidden layers represent composite patterns.',
                },
                {
                  question: 'How many input neurons are used for a 28x28 grayscale image of a handwritten digit?',
                  options: JSON.stringify(['784 neurons', '100 neurons', '28 neurons', '10 neurons']),
                  correct_answer: '784 neurons',
                  explanation: '28 multiplied by 28 equals 784 individual pixel neurons.',
                },
              ],
            },
          },
          {
            order_index: 1,
            title: '2. Layer Architecture & Weighted Sums',
            summary: 'How layers recognize sub-components (edges, loops) via weights, biases, and activation functions.',
            start_seconds: 300,
            end_seconds: 660,
            quiz_questions: {
              create: [
                {
                  question: 'Why do hidden layers combine previous neurons with weights and biases?',
                  options: JSON.stringify([
                    'To detect increasingly complex sub-components like edges, loops, and strokes',
                    'To compress the image into a JPEG format',
                    'To randomize the input data for security encryption',
                    'To reduce computation speed purposely',
                  ]),
                  correct_answer: 'To detect increasingly complex sub-components like edges, loops, and strokes',
                  explanation: 'Each subsequent layer aggregates lower-level features into higher-level representations.',
                },
                {
                  question: 'What is the purpose of the Bias term in a neuron activation formula?',
                  options: JSON.stringify([
                    'It sets a threshold for how active the neuron needs to be before it fires meaningfully',
                    'It prevents the computer from overheating',
                    'It permanently sets the output to zero',
                    'It multiplies the learning rate by two',
                  ]),
                  correct_answer: 'It sets a threshold for how active the neuron needs to be before it fires meaningfully',
                  explanation: 'The bias acts as an offset/threshold determining when the weighted sum is meaningful enough to trigger activation.',
                },
              ],
            },
          },
          {
            order_index: 2,
            title: '3. Sigmoid, ReLU & Matrix Representation',
            summary: 'Mathematical compact notation using linear algebra matrix-vector products and non-linearities.',
            start_seconds: 660,
            end_seconds: 1152,
            quiz_questions: {
              create: [
                {
                  question: 'Why is non-linearity (like Sigmoid or ReLU) necessary in deep neural networks?',
                  options: JSON.stringify([
                    'Without non-linearities, multiple layers would collapse into a single linear transformation',
                    'Because GPUs cannot compute linear equations',
                    'To ensure output numbers are always negative',
                    'To make matrix multiplications impossible',
                  ]),
                  correct_answer: 'Without non-linearities, multiple layers would collapse into a single linear transformation',
                  explanation: 'Composing linear operations just yields another linear operation. Non-linear activation functions enable networks to approximate any complex continuous function.',
                },
                {
                  question: 'In matrix notation, how is an entire layer computed compactly?',
                  options: JSON.stringify([
                    'a^(l) = σ(W · a^(l-1) + b)',
                    'a^(l) = W / b',
                    'a^(l) = (a^(l-1))^2',
                    'a^(l) = sum(b) - W',
                  ]),
                  correct_answer: 'a^(l) = σ(W · a^(l-1) + b)',
                  explanation: 'The activation vector is calculated by multiplying the weight matrix with the previous layer activations, adding the bias vector, and applying the activation function σ.',
                },
              ],
            },
          },
        ],
      },
      flashcards: {
        create: [
          {
            front: 'What is an Artificial Neuron?',
            back: 'A computational unit that holds a numerical activation, computed by applying a non-linear function to a weighted sum of inputs plus a bias.',
          },
          {
            front: 'What is the function of a Weight (W)?',
            back: 'A parameter that scales the strength and influence of a connection between two neurons across adjacent layers.',
          },
          {
            front: 'What is the role of a Bias (b)?',
            back: 'A tunable threshold parameter added to the weighted sum that determines how easily a neuron activates.',
          },
          {
            front: 'Why is ReLU (Rectified Linear Unit) favored over Sigmoid in modern deep nets?',
            back: 'ReLU (max(0, x)) avoids the vanishing gradient problem and is much faster to compute than exponential sigmoid operations.',
          },
        ],
      },
    },
  });

  // Video 2: React 19 & Next.js Architecture
  const v2 = await prisma.video.create({
    data: {
      youtube_video_id: 'rGezsHbz60Y',
      title: 'React Server Components: The Complete Mental Model',
      channel: 'Jack Herrington',
      duration_seconds: 840,
      thumbnail_url: 'https://img.youtube.com/vi/rGezsHbz60Y/maxresdefault.jpg',
      status: 'ready',
      segments: {
        create: [
          {
            order_index: 0,
            title: '1. Server vs Client Component Boundary',
            summary: 'How React separates server-only execution from client hydration bundle.',
            start_seconds: 0,
            end_seconds: 280,
            quiz_questions: {
              create: [
                {
                  question: 'Do React Server Components (RSC) send JavaScript bundles to the browser?',
                  options: JSON.stringify([
                    'No, they render to a JSON-like virtual DOM stream on the server and send 0KB JS bundle',
                    'Yes, they double the client JavaScript bundle size',
                    'Only if Webpack is disabled',
                    'They only send raw CSS files',
                  ]),
                  correct_answer: 'No, they render to a JSON-like virtual DOM stream on the server and send 0KB JS bundle',
                  explanation: 'Server Components execute only on the server, producing rendered UI without adding to the client-side JavaScript bundle.',
                },
                {
                  question: 'Which directive designates an interactive Client Component in Next.js App Router?',
                  options: JSON.stringify(["'use client'", "'use server'", "'client only'", "'export default client'"]),
                  correct_answer: "'use client'",
                  explanation: "The 'use client' directive marks the boundary where interactive components and hooks (useState, useEffect) are bundled for the browser.",
                },
              ],
            },
          },
          {
            order_index: 1,
            title: '2. Data Fetching & Streaming with Suspense',
            summary: 'Async components, direct database access, and non-blocking streaming UI.',
            start_seconds: 280,
            end_seconds: 560,
            quiz_questions: {
              create: [
                {
                  question: 'Can React Server Components be declared as async functions?',
                  options: JSON.stringify([
                    'Yes, allowing direct await calls for database or API fetching without useEffect',
                    'No, React components cannot be async',
                    'Only in class components',
                    'Only inside Web Workers',
                  ]),
                  correct_answer: 'Yes, allowing direct await calls for database or API fetching without useEffect',
                  explanation: 'Server Components natively support async/await, eliminating client fetching waterfalls and useEffect boilerplate.',
                },
                {
                  question: 'What React feature enables progressive streaming of slow server components?',
                  options: JSON.stringify(['<Suspense fallback={...}>', '<ErrorBoundary>', '<Fragment>', '<StrictMode>']),
                  correct_answer: '<Suspense fallback={...}>',
                  explanation: 'React Suspense allows parts of the page to stream in chunks as soon as their data resolves while displaying fallback skeletons.',
                },
              ],
            },
          },
          {
            order_index: 2,
            title: '3. Server Actions & Mutations',
            summary: 'Handling form submissions, revalidations, and cache updates seamlessly.',
            start_seconds: 560,
            end_seconds: 840,
            quiz_questions: {
              create: [
                {
                  question: 'What directive declares a Server Action in Next.js?',
                  options: JSON.stringify(["'use server'", "'use action'", "'action server'", "'async server'"]),
                  correct_answer: "'use server'",
                  explanation: "The 'use server' directive at file or function level turns a function into an RPC endpoint for handling mutations and form submissions.",
                },
                {
                  question: 'How do you refresh server component data after a mutation in Server Actions?',
                  options: JSON.stringify([
                    'revalidatePath() or revalidateTag()',
                    'window.location.reload()',
                    'document.refresh()',
                    'forceUpdate()',
                  ]),
                  correct_answer: 'revalidatePath() or revalidateTag()',
                  explanation: 'Next.js provides revalidatePath and revalidateTag to purge cached data and push new server-rendered state.',
                },
              ],
            },
          },
        ],
      },
      flashcards: {
        create: [
          {
            front: 'What is a React Server Component (RSC)?',
            back: 'A component that runs exclusively on the server, can access backend resources directly, and ships 0 client JavaScript.',
          },
          {
            front: 'When should you use "use client"?',
            back: 'When a component needs browser APIs, event listeners (onClick, onChange), React hooks (useState, useEffect), or custom browser state.',
          },
          {
            front: 'How does UI Streaming work with React Suspense?',
            back: 'The server flushes the initial HTML shell immediately and streams additional UI chunks over the same HTTP response as promises resolve.',
          },
        ],
      },
    },
  });

  // Seed Initial User Progress for v1
  await prisma.userVideoProgress.create({
    data: {
      user_id: 'default_user',
      video_id: v1.id,
      current_segment_index: 1,
      completed_segment_ids: JSON.stringify([v1.id + '_seg_0']),
      last_watched_at: new Date(),
    },
  });

  // Seed Sidebar Tasks
  await prisma.task.createMany({
    data: [
      {
        user_id: 'default_user',
        label: 'Complete Neural Networks Chapter 1 quiz checkpoints',
        done: false,
        linked_video_id: v1.id,
      },
      {
        user_id: 'default_user',
        label: 'Review 5 flashcards on React Server Components',
        done: true,
        linked_video_id: v2.id,
      },
      {
        user_id: 'default_user',
        label: 'Test camera attention strict mode on 10-minute focus session',
        done: false,
        linked_video_id: v1.id,
      },
    ],
  });

  // Seed Chat Assistant Welcome Messages
  await prisma.chatMessage.create({
    data: {
      user_id: 'default_user',
      role: 'assistant',
      content:
        '👋 Welcome to **Saras AI**! I am your AI learning companion. Tell me what subject you want to master (e.g. "Transformers in AI", "System Design", "Rust fundamentals"), or paste any YouTube URL to turn it into an interactive quiz-gated lesson!',
    },
  });

  console.log('✅ Learnly database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
