export interface CourseQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface CourseSegment {
  id: string;
  order_index: number;
  title: string;
  summary: string;
  start_seconds: number;
  end_seconds: number;
  quiz_questions: CourseQuizQuestion[];
}

export interface CourseVideo {
  id: string;
  youtube_video_id: string;
  title: string;
  channel: string;
  duration_seconds: number;
  thumbnail_url: string;
  chapter_number: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  status: 'ready';
  segments: CourseSegment[];
}

export interface CourseModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  playlistUrl: string;
  channel: string;
  videos: CourseVideo[];
}

export interface CourseSection {
  id: string;
  title: string;
  badge: string;
  description: string;
  modules: CourseModule[];
}

export const VERTEX_GDNA_COURSE: CourseSection = {
  id: 'vertex-gdna-course',
  title: 'Vertex GDNA Course',
  badge: 'Google Cloud Vertex AI & Deep Learning Track',
  description:
    'An industry-grade specialization on Deep Learning, Neural Network Mathematics, Transformers, and Multimodal Generative AI built in collaboration with 3Blue1Brown.',
  modules: [
    {
      id: 'vertex-gdna-mod-1',
      title: 'Module 1: Deep Learning Foundations & Transformer Architectures',
      subtitle: 'From Neurons & Gradient Descent to Self-Attention, LLMs & Diffusion',
      description:
        'A comprehensive 10-chapter curriculum covering the visual mathematics of neural representations, backpropagation calculus, self-attention mechanics, transformer parameter scaling, cross-entropy loss, and diffusion vector fields.',
      playlistUrl: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi',
      channel: '3Blue1Brown',
      videos: [
        {
          id: 'aircAruvnKk',
          youtube_video_id: 'aircAruvnKk',
          title: 'But what is a neural network? | Deep learning, chapter 1',
          channel: '3Blue1Brown',
          duration_seconds: 1106,
          thumbnail_url: 'https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg',
          chapter_number: 1,
          difficulty: 'Beginner',
          summary: 'Master artificial neurons, activations between 0 and 1, feature hierarchies, weighted sums, biases, and compact matrix algebra.',
          status: 'ready',
          segments: [
            {
              id: 'aircAruvnKk-s1',
              order_index: 0,
              title: '1. What are Neurons & Numerical Activations?',
              summary: 'Understanding neurons as numbers between 0 and 1 representing feature intensity or grayscale pixel activations.',
              start_seconds: 0,
              end_seconds: 300,
              quiz_questions: [
                {
                  id: 'aircAruvnKk-q1',
                  question: 'In the context of the digit recognition network, what does the activation of a neuron represent?',
                  options: [
                    'A number typically between 0 and 1 representing grayscale intensity or feature presence',
                    'The physical clock voltage of the host CPU',
                    'A binary boolean flag restricted to 0 or 1 without decimals',
                    'The raw memory pointer of the input pixel buffer'
                  ],
                  correct_answer: 'A number typically between 0 and 1 representing grayscale intensity or feature presence',
                  explanation: 'First-layer activations encode pixel brightness (0 to 1), and deeper layers represent composite sub-features.'
                },
                {
                  id: 'aircAruvnKk-q2',
                  question: 'How many input neurons are needed to ingest a 28x28 grayscale image of a handwritten digit?',
                  options: ['784 neurons', '100 neurons', '28 neurons', '10 neurons'],
                  correct_answer: '784 neurons',
                  explanation: '28 multiplied by 28 equals 784 individual pixel neurons.'
                }
              ]
            },
            {
              id: 'aircAruvnKk-s2',
              order_index: 1,
              title: '2. Layer Architecture, Weighted Sums & Biases',
              summary: 'How hidden layers aggregate lower-level components like edges and loops using weights, biases, and thresholds.',
              start_seconds: 300,
              end_seconds: 660,
              quiz_questions: [
                {
                  id: 'aircAruvnKk-q3',
                  question: 'Why do hidden layers combine previous neurons with weighted connections?',
                  options: [
                    'To detect increasingly complex sub-components like edges, loops, and strokes',
                    'To compress the image into JPEG compression blocks',
                    'To encrypt user inputs for cryptographic secrecy',
                    'To intentionally throttle GPU computing speed'
                  ],
                  correct_answer: 'To detect increasingly complex sub-components like edges, loops, and strokes',
                  explanation: 'Each subsequent layer aggregates lower-level patterns into higher-level semantic representations.'
                },
                {
                  id: 'aircAruvnKk-q4',
                  question: 'What is the role of the Bias term in computing neuron activation?',
                  options: [
                    'It establishes an offset threshold determining how active the weighted sum must be to fire meaningfully',
                    'It prevents the motherboard power supply from overheating',
                    'It permanently zeroes out negative floating point values',
                    'It doubles the learning rate after every epoch'
                  ],
                  correct_answer: 'It establishes an offset threshold determining how active the weighted sum must be to fire meaningfully',
                  explanation: 'The bias acts as an offset threshold determining whether the weighted sum is large enough to activate the neuron.'
                }
              ]
            },
            {
              id: 'aircAruvnKk-s3',
              order_index: 2,
              title: '3. Sigmoid, ReLU & Compact Matrix Algebra',
              summary: 'Why non-linear activation functions are mathematically necessary and how layers are computed via matrix-vector products.',
              start_seconds: 660,
              end_seconds: 1106,
              quiz_questions: [
                {
                  id: 'aircAruvnKk-q5',
                  question: 'Why is non-linearity (such as Sigmoid or ReLU) required in deep neural networks?',
                  options: [
                    'Without non-linearities, multiple layers would collapse mathematically into a single linear transformation',
                    'Because GPUs are incapable of calculating linear matrix products',
                    'To ensure output activations are always strictly negative numbers',
                    'To guarantee that matrix multiplication yields undefined values'
                  ],
                  correct_answer: 'Without non-linearities, multiple layers would collapse mathematically into a single linear transformation',
                  explanation: 'Composing purely linear operations always collapses into a single linear map; non-linearities allow neural networks to approximate arbitrary functions.'
                },
                {
                  id: 'aircAruvnKk-q6',
                  question: 'In compact matrix notation, how is the activation vector of layer (l) expressed?',
                  options: [
                    'a^(l) = σ(W · a^(l-1) + b)',
                    'a^(l) = W / b',
                    'a^(l) = (a^(l-1))^2 - W',
                    'a^(l) = sum(b) * W'
                  ],
                  correct_answer: 'a^(l) = σ(W · a^(l-1) + b)',
                  explanation: 'The activation vector equals the non-linear activation function σ applied to the matrix-vector product of weight matrix W and previous activations a^(l-1), plus bias vector b.'
                }
              ]
            }
          ]
        },
        {
          id: 'IHZwWFHWa-w',
          youtube_video_id: 'IHZwWFHWa-w',
          title: 'Gradient descent, how neural networks learn | Deep Learning Chapter 2',
          channel: '3Blue1Brown',
          duration_seconds: 1213,
          thumbnail_url: 'https://img.youtube.com/vi/IHZwWFHWa-w/maxresdefault.jpg',
          chapter_number: 2,
          difficulty: 'Intermediate',
          summary: 'Understand the cost function, high-dimensional loss landscapes, gradient vectors, and the mechanics of gradient descent optimization.',
          status: 'ready',
          segments: [
            {
              id: 'IHZwWFHWa-w-s1',
              order_index: 0,
              title: '1. The Cost Function & Measuring Network Error',
              summary: 'How the sum of squared differences between desired activations and network outputs provides a single error score across all training samples.',
              start_seconds: 0,
              end_seconds: 320,
              quiz_questions: [
                {
                  id: 'IHZwWFHWa-w-q1',
                  question: 'What does the Cost Function compute for a neural network across training data?',
                  options: [
                    'The average sum of squared differences between target outputs and actual network predictions',
                    'The total monetary server expense required to train on cloud GPUs',
                    'The count of floating-point arithmetic operations executed per second',
                    'The physical RAM occupied by weight matrices in system cache'
                  ],
                  correct_answer: 'The average sum of squared differences between target outputs and actual network predictions',
                  explanation: 'The cost function aggregates the squared residuals across all outputs and training examples to quantify overall model error.'
                },
                {
                  id: 'IHZwWFHWa-w-q2',
                  question: 'When the network predicts the correct digit with high confidence, how does the cost value respond?',
                  options: [
                    'The cost approaches zero',
                    'The cost diverges towards infinity',
                    'The cost oscillates between negative values',
                    'The cost becomes undefined due to division by zero'
                  ],
                  correct_answer: 'The cost approaches zero',
                  explanation: 'Small residuals produce a minimal cost, signaling accurate classification.'
                }
              ]
            },
            {
              id: 'IHZwWFHWa-w-s2',
              order_index: 1,
              title: '2. Gradient Descent in High-Dimensional Landscapes',
              summary: 'Navigating an 13,000-dimensional parameter landscape by stepping in the direction of steepest descent given by the negative gradient.',
              start_seconds: 320,
              end_seconds: 700,
              quiz_questions: [
                {
                  id: 'IHZwWFHWa-w-q3',
                  question: 'What does the negative gradient vector (-∇C) mathematically signify?',
                  options: [
                    'The direction in parameter space along which the cost function decreases most rapidly',
                    'The rate of GPU hardware clock degradation',
                    'The optimal learning rate constant for Adam optimizer',
                    'The probability distribution of incorrect class predictions'
                  ],
                  correct_answer: 'The direction in parameter space along which the cost function decreases most rapidly',
                  explanation: 'While the gradient ∇C points in the direction of steepest ascent, its negative points along steepest descent.'
                },
                {
                  id: 'IHZwWFHWa-w-q4',
                  question: 'What does the magnitude of each component in the gradient vector indicate?',
                  options: [
                    'The sensitivity of the cost function to small nudges in that specific weight or bias',
                    'The physical size in bytes of the corresponding weight float',
                    'The percentage of training examples correctly classified by that neuron',
                    'The number of GPU threads assigned to that parameter'
                  ],
                  correct_answer: 'The sensitivity of the cost function to small nudges in that specific weight or bias',
                  explanation: 'Components with larger magnitudes demonstrate that modifying that specific weight has a proportionally larger impact on reducing cost.'
                }
              ]
            },
            {
              id: 'IHZwWFHWa-w-s3',
              order_index: 2,
              title: '3. Mini-Batch Stochastic Gradient Descent (SGD)',
              summary: 'Why evaluating all training images every step is too slow, and how computing gradients over small random mini-batches speeds up learning.',
              start_seconds: 700,
              end_seconds: 1213,
              quiz_questions: [
                {
                  id: 'IHZwWFHWa-w-q5',
                  question: 'Why does machine learning utilize Mini-Batch Stochastic Gradient Descent rather than true full-batch gradient descent?',
                  options: [
                    'Computing the true gradient over millions of images per single step is computationally intractable and slow',
                    'Because full-batch gradient descent is mathematically invalid in linear algebra',
                    'Because mini-batches automatically double the resolution of training images',
                    'To avoid floating-point overflow errors in the Python compiler'
                  ],
                  correct_answer: 'Computing the true gradient over millions of images per single step is computationally intractable and slow',
                  explanation: 'Mini-batches approximate the true gradient rapidly, allowing thousands of optimization updates in the time a single full-batch pass would require.'
                },
                {
                  id: 'IHZwWFHWa-w-q6',
                  question: 'What determines the step size taken along the negative gradient vector during each iteration?',
                  options: [
                    'The Learning Rate hyperparameter',
                    'The monitor screen refresh rate',
                    'The number of color channels in the input image',
                    'The total number of CPU cores in the host machine'
                  ],
                  correct_answer: 'The Learning Rate hyperparameter',
                  explanation: 'The learning rate scales the gradient step size to ensure stable convergence without overshooting minima.'
                }
              ]
            }
          ]
        },
        {
          id: 'Ilg3gGewQ5U',
          youtube_video_id: 'Ilg3gGewQ5U',
          title: 'Backpropagation, intuitively | Deep Learning Chapter 3',
          channel: '3Blue1Brown',
          duration_seconds: 748,
          thumbnail_url: 'https://img.youtube.com/vi/Ilg3gGewQ5U/maxresdefault.jpg',
          chapter_number: 3,
          difficulty: 'Intermediate',
          summary: 'A visual walkthrough of how backpropagation calculates desired nudges to weights and activations from output back to input.',
          status: 'ready',
          segments: [
            {
              id: 'Ilg3gGewQ5U-s1',
              order_index: 0,
              title: '1. Desired Output Nudges & Propagating Desires',
              summary: 'How an erroneous prediction produces specific desired increases and decreases in output neuron activations.',
              start_seconds: 0,
              end_seconds: 240,
              quiz_questions: [
                {
                  id: 'Ilg3gGewQ5U-q1',
                  question: 'When the network misclassifies an image of a 2 as an 8, what are the immediate desired changes at the output layer?',
                  options: [
                    'Increase the activation of neuron 2 and decrease activations of all other digits (especially 8)',
                    'Set all output neuron activations uniformly to 0.5',
                    'Randomize the activations across all output neurons',
                    'Invert the RGB color channels of the input image'
                  ],
                  correct_answer: 'Increase the activation of neuron 2 and decrease activations of all other digits (especially 8)',
                  explanation: 'Backpropagation begins by identifying the exact directional changes needed at the output layer to reduce the loss.'
                },
                {
                  id: 'Ilg3gGewQ5U-q2',
                  question: 'How are desired changes to a neuron activation achieved in practice?',
                  options: [
                    'By adjusting its bias, adjusting connecting weights in proportion to previous activations, and nudging previous activations',
                    'By manually writing if/else rules for the neuron in Python',
                    'By increasing the electrical voltage delivered to the GPU',
                    'By deleting negative weights permanently from memory'
                  ],
                  correct_answer: 'By adjusting its bias, adjusting connecting weights in proportion to previous activations, and nudging previous activations',
                  explanation: 'A neuron activation is modulated via its bias, connecting weights, and the upstream activations feeding into it.'
                }
              ]
            },
            {
              id: 'Ilg3gGewQ5U-s2',
              order_index: 1,
              title: '2. Aggregating Adjustments Across Hidden Layers',
              summary: 'How desires from all output neurons are pooled together to form a coherent update signal for the second-to-last layer.',
              start_seconds: 240,
              end_seconds: 520,
              quiz_questions: [
                {
                  id: 'Ilg3gGewQ5U-q3',
                  question: 'Why does a weight connecting a brightly activated neuron get adjusted more than one connected to an inactive neuron?',
                  options: [
                    'Because the derivative of the weighted sum with respect to weight w is the activation a of the previous neuron',
                    'Because inactive neurons are automatically garbage collected by the compiler',
                    'Because weights can only store positive numbers',
                    'Because inactive neurons have infinite resistance'
                  ],
                  correct_answer: 'Because the derivative of the weighted sum with respect to weight w is the activation a of the previous neuron',
                  explanation: 'Since ∂z/∂w = a_prev, weights tied to large activations have much greater influence on the output, receiving larger gradient updates.'
                },
                {
                  id: 'Ilg3gGewQ5U-q4',
                  question: 'How are competing desires for a hidden neuron from multiple output neurons reconciled?',
                  options: [
                    'They are summed together, yielding an aggregate net nudge',
                    'The network discards all conflicting desires and defaults to zero',
                    'Only the desire with the largest font size is kept',
                    'A random coin flip decides which desire is adopted'
                  ],
                  correct_answer: 'They are summed together, yielding an aggregate net nudge',
                  explanation: 'The multivariable chain rule aggregates the influences of all downstream paths by summing their partial derivatives.'
                }
              ]
            },
            {
              id: 'Ilg3gGewQ5U-s3',
              order_index: 2,
              title: '3. Global Averaging Across Training Examples',
              summary: 'How backpropagation runs on individual examples and is averaged over training mini-batches to guide gradient descent.',
              start_seconds: 520,
              end_seconds: 748,
              quiz_questions: [
                {
                  id: 'Ilg3gGewQ5U-q5',
                  question: 'What is backpropagation fundamentally computing for each parameter in the entire network?',
                  options: [
                    'The exact partial derivative of the cost function with respect to that parameter (∂C/∂w)',
                    'The execution latency of that layer in milliseconds',
                    'The optimal learning rate for the next training epoch',
                    'The accuracy score of the validation set'
                  ],
                  correct_answer: 'The exact partial derivative of the cost function with respect to that parameter (∂C/∂w)',
                  explanation: 'Backpropagation is an efficient algorithmic implementation of the multivariable chain rule to compute all gradient components ∂C/∂w and ∂C/∂b.'
                },
                {
                  id: 'Ilg3gGewQ5U-q6',
                  question: 'Why does averaging gradient vectors across examples prevent catastrophic forgetting during batch training?',
                  options: [
                    'It ensures parameter updates satisfy the consensus requirements of all samples in the batch rather than overfitting to one',
                    'It reduces the memory size of image tensors by half',
                    'It converts non-convex loss functions into convex linear equations',
                    'It eliminates the need for activation functions'
                  ],
                  correct_answer: 'It ensures parameter updates satisfy the consensus requirements of all samples in the batch rather than overfitting to one',
                  explanation: 'Averaging across diverse examples finds parameter updates that reduce overall cost across the general population.'
                }
              ]
            }
          ]
        },
        {
          id: 'tIeHLnjs5U8',
          youtube_video_id: 'tIeHLnjs5U8',
          title: 'Backpropagation calculus | Deep Learning Chapter 4',
          channel: '3Blue1Brown',
          duration_seconds: 583,
          thumbnail_url: 'https://img.youtube.com/vi/tIeHLnjs5U8/maxresdefault.jpg',
          chapter_number: 4,
          difficulty: 'Advanced',
          summary: 'The formal mathematical derivation of backpropagation using the multivariable Chain Rule, partial derivatives, and matrix products.',
          status: 'ready',
          segments: [
            {
              id: 'tIeHLnjs5U8-s1',
              order_index: 0,
              title: '1. The Single-Neuron Chain Rule Foundation',
              summary: 'Deconstructing the derivative of cost C with respect to weight w into three factors: ∂C/∂a, ∂a/∂z, and ∂z/∂w.',
              start_seconds: 0,
              end_seconds: 200,
              quiz_questions: [
                {
                  id: 'tIeHLnjs5U8-q1',
                  question: 'By the Chain Rule, what is the formula for the partial derivative ∂C/∂w?',
                  options: [
                    '∂C/∂w = (∂z/∂w) · (∂a/∂z) · (∂C/∂a)',
                    '∂C/∂w = ∂C/∂z + ∂z/∂a',
                    '∂C/∂w = (∂C/∂a) / (∂a/∂w)',
                    '∂C/∂w = w · a + b'
                  ],
                  correct_answer: '∂C/∂w = (∂z/∂w) · (∂a/∂z) · (∂C/∂a)',
                  explanation: 'The chain rule multiplies the rate of change of each intermediate dependency: z depends on w, a depends on z, and C depends on a.'
                },
                {
                  id: 'tIeHLnjs5U8-q2',
                  question: 'Given the weighted sum z = w · a_prev + b, what is the derivative ∂z/∂w?',
                  options: [
                    'a_prev (the activation of the upstream neuron)',
                    'w (the weight value)',
                    'b (the bias value)',
                    '0'
                  ],
                  correct_answer: 'a_prev (the activation of the upstream neuron)',
                  explanation: 'Taking the derivative of linear term w · a_prev with respect to w leaves the coefficient a_prev.'
                }
              ]
            },
            {
              id: 'tIeHLnjs5U8-s2',
              order_index: 1,
              title: '2. Multivariable Chain Rule & Summing Over Layers',
              summary: 'When a neuron connects to multiple downstream neurons, its influence is computed by summing the partial derivatives across all outgoing paths.',
              start_seconds: 200,
              end_seconds: 400,
              quiz_questions: [
                {
                  id: 'tIeHLnjs5U8-q3',
                  question: 'When an activation a^(l-1) influences multiple neurons in the next layer, how is ∂C/∂a^(l-1) calculated?',
                  options: [
                    'By summing the contributions across all connected neurons: ∑_j (∂z_j/∂a) · (∂a_j/∂z_j) · (∂C/∂a_j)',
                    'By taking the maximum single gradient and ignoring other paths',
                    'By averaging the biases of the destination layer',
                    'By multiplying all output layer activations together'
                  ],
                  correct_answer: 'By summing the contributions across all connected neurons: ∑_j (∂z_j/∂a) · (∂a_j/∂z_j) · (∂C/∂a_j)',
                  explanation: 'The multivariable chain rule states that when a variable affects the output through multiple intermediate paths, the total rate of change is the sum of changes along each path.'
                },
                {
                  id: 'tIeHLnjs5U8-q4',
                  question: 'What is the derivative of the weighted sum z with respect to the bias b (∂z/∂b)?',
                  options: [
                    '1',
                    '0',
                    'w',
                    'a_prev'
                  ],
                  correct_answer: '1',
                  explanation: 'Since z = w · a + b, the derivative of z with respect to b is simply 1.'
                }
              ]
            },
            {
              id: 'tIeHLnjs5U8-s3',
              order_index: 2,
              title: '3. Matrix Formulation of Gradient Computation',
              summary: 'Transforming backpropagation into high-speed GPU matrix multiplications using weight transposes and Hadamard element-wise products.',
              start_seconds: 400,
              end_seconds: 583,
              quiz_questions: [
                {
                  id: 'tIeHLnjs5U8-q5',
                  question: 'Why are backpropagation steps implemented as matrix multiplications on hardware accelerators?',
                  options: [
                    'Transposing the weight matrix W^T allows computing all upstream error vectors δ^(l-1) in parallel in a single tensor operation',
                    'Because GPUs cannot execute addition operations',
                    'To reduce floating point precision to 1 bit integers',
                    'Because linear algebra prohibits loops in C++'
                  ],
                  correct_answer: 'Transposing the weight matrix W^T allows computing all upstream error vectors δ^(l-1) in parallel in a single tensor operation',
                  explanation: 'Matrix transposition aligns dimensions so that upstream error vectors propagate backward in a single parallelizable gemm operation.'
                },
                {
                  id: 'tIeHLnjs5U8-q6',
                  question: 'What is the error vector δ^(l) commonly defined as in neural network literature?',
                  options: [
                    'The partial derivative of cost with respect to the weighted input vector: ∂C/∂z^(l)',
                    'The difference between training loss and test accuracy',
                    'The physical RAM allocation error code',
                    'The inverse square of learning rate η'
                  ],
                  correct_answer: 'The partial derivative of cost with respect to the weighted input vector: ∂C/∂z^(l)',
                  explanation: 'Defining δ^(l) = ∂C/∂z^(l) simplifies backpropagation recursions across all layers.'
                }
              ]
            }
          ]
        },
        {
          id: 'LPZh9BOjkQs',
          youtube_video_id: 'LPZh9BOjkQs',
          title: 'Large Language Models explained briefly',
          channel: '3Blue1Brown',
          duration_seconds: 457,
          thumbnail_url: 'https://img.youtube.com/vi/LPZh9BOjkQs/maxresdefault.jpg',
          chapter_number: 5,
          difficulty: 'Beginner',
          summary: 'A fast, intuitive overview of how Large Language Models generate text by repeatedly predicting the next token in high-dimensional semantic spaces.',
          status: 'ready',
          segments: [
            {
              id: 'LPZh9BOjkQs-s1',
              order_index: 0,
              title: '1. Next-Token Autoregressive Generation',
              summary: 'How text generation reduces to taking a sequence of tokens and sampling the probability distribution for what comes next.',
              start_seconds: 0,
              end_seconds: 150,
              quiz_questions: [
                {
                  id: 'LPZh9BOjkQs-q1',
                  question: 'At its core fundamental operating loop, what task is an autoregressive Large Language Model trained to perform?',
                  options: [
                    'Given a sequence of input tokens, output a probability distribution predicting the next token',
                    'Store every Wikipedia article verbatim in a relational SQL database',
                    'Translate human English words into binary machine assembly code',
                    'Scan the internet live in real-time for every prompt'
                  ],
                  correct_answer: 'Given a sequence of input tokens, output a probability distribution predicting the next token',
                  explanation: 'LLMs are generative models trained on self-supervised next-token prediction across vast text corpora.'
                },
                {
                  id: 'LPZh9BOjkQs-q2',
                  question: 'What is a "Token" in the context of modern language models?',
                  options: [
                    'A chunk of text, typically corresponding to a word, subword, or punctuation mark',
                    'A cryptographic cryptocurrency coin used to pay for API queries',
                    'A physical hardware dongle plugged into the server motherboard',
                    'A special security password known only to the model'
                  ],
                  correct_answer: 'A chunk of text, typically corresponding to a word, subword, or punctuation mark',
                  explanation: 'Tokenizers decompose raw strings into standardized vocabulary chunks (often 3-4 characters on average in English).'
                }
              ]
            },
            {
              id: 'LPZh9BOjkQs-s2',
              order_index: 1,
              title: '2. Word Embeddings & Vector Space Geometry',
              summary: 'Translating discrete words into continuous vectors where directions and distances represent semantic relationships.',
              start_seconds: 150,
              end_seconds: 300,
              quiz_questions: [
                {
                  id: 'LPZh9BOjkQs-q3',
                  question: 'Why does the model represent words as vectors in a high-dimensional space?',
                  options: [
                    'Geometric directions and distances in vector space encode semantic meaning, analogies, and grammatical roles',
                    'Because computers cannot store alphabetical letters',
                    'To reduce the total number of dictionary words to 256',
                    'To encrypt the text so competitors cannot read it'
                  ],
                  correct_answer: 'Geometric directions and distances in vector space encode semantic meaning, analogies, and grammatical roles',
                  explanation: 'Embedding spaces map conceptual similarities to geometric proximity, enabling vector arithmetic like King - Man + Woman = Queen.'
                },
                {
                  id: 'LPZh9BOjkQs-q4',
                  question: 'What happens to a token vector as it flows through the layers of a transformer?',
                  options: [
                    'It gathers contextual information from surrounding words, updating its semantic coordinates to reflect its precise meaning in context',
                    'It stays completely frozen and unchanged until the final output layer',
                    'Its dimensionality is halved at every layer',
                    'It is converted into a compressed MP3 audio frequency'
                  ],
                  correct_answer: 'It gathers contextual information from surrounding words, updating its semantic coordinates to reflect its precise meaning in context',
                  explanation: 'Self-attention allows token vectors to exchange context so that words like "bank" update their representation depending on whether "river" or "money" appears.'
                }
              ]
            },
            {
              id: 'LPZh9BOjkQs-s3',
              order_index: 2,
              title: '3. Sampling, Temperature & Emergent Behavior',
              summary: 'How temperature controls randomness in token selection and why simple next-token objectives lead to complex reasoning.',
              start_seconds: 300,
              end_seconds: 457,
              quiz_questions: [
                {
                  id: 'LPZh9BOjkQs-q5',
                  question: 'What effect does increasing the Temperature parameter have during token generation?',
                  options: [
                    'It flattens the probability distribution, making outputs more diverse and creative (at the risk of hallucination)',
                    'It forces the GPU fans to spin at maximum speed',
                    'It strictly locks the model into choosing only the single most probable token (ArgMax)',
                    'It truncates the context window to fewer tokens'
                  ],
                  correct_answer: 'It flattens the probability distribution, making outputs more diverse and creative (at the risk of hallucination)',
                  explanation: 'Dividing logits by a higher temperature spreads probability mass more evenly across candidate tokens.'
                },
                {
                  id: 'LPZh9BOjkQs-q6',
                  question: 'What is "Greedy Decoding" (Temperature = 0)?',
                  options: [
                    'Deterministically selecting the token with the highest predicted probability at every step',
                    'Selecting random tokens regardless of model predictions',
                    'Charging the user extra credits for API usage',
                    'Skipping transformer layers to generate faster'
                  ],
                  correct_answer: 'Deterministically selecting the token with the highest predicted probability at every step',
                  explanation: 'At temperature 0, the sampling operation becomes an argmax selection of the top logit.'
                }
              ]
            }
          ]
        },
        {
          id: 'wjZofJX0v4M',
          youtube_video_id: 'wjZofJX0v4M',
          title: 'Transformers, the tech behind LLMs | Deep Learning Chapter 5',
          channel: '3Blue1Brown',
          duration_seconds: 1613,
          thumbnail_url: 'https://img.youtube.com/vi/wjZofJX0v4M/maxresdefault.jpg',
          chapter_number: 6,
          difficulty: 'Intermediate',
          summary: 'Explore the complete inner anatomy of the transformer: token embeddings, high-dimensional spaces, unembedding matrices, and softmax with temperature.',
          status: 'ready',
          segments: [
            {
              id: 'wjZofJX0v4M-s1',
              order_index: 0,
              title: '1. Inside a Transformer: Predict, Sample & Repeat',
              summary: 'The end-to-end architecture: processing a stream of tokens through parallel attention and feed-forward blocks to produce output logits.',
              start_seconds: 0,
              end_seconds: 440,
              quiz_questions: [
                {
                  id: 'wjZofJX0v4M-q1',
                  question: 'What are the two alternating core sub-layers found in every standard transformer block?',
                  options: [
                    'Multi-Head Self-Attention and Multi-Layer Perceptron (Feed-Forward Network)',
                    'Convolutional 2D filters and Max-Pooling layers',
                    'Recurrent LSTM memory gates and Relational Databases',
                    'Fourier Transform filters and Binary Decision Trees'
                  ],
                  correct_answer: 'Multi-Head Self-Attention and Multi-Layer Perceptron (Feed-Forward Network)',
                  explanation: 'Attention enables token-to-token communication, while the MLP applies non-linear feature transformation to each token independently.'
                },
                {
                  id: 'wjZofJX0v4M-q2',
                  question: 'How do transformer models process input tokens compared to older Recurrent Neural Networks (RNNs)?',
                  options: [
                    'All input tokens are processed simultaneously in parallel via attention matrices rather than sequentially one word at a time',
                    'Tokens are evaluated in reverse alphabetical order',
                    'Tokens are processed sequentially through a single hidden recurrence loop',
                    'Only the last word of a sentence is passed to the network'
                  ],
                  correct_answer: 'All input tokens are processed simultaneously in parallel via attention matrices rather than sequentially one word at a time',
                  explanation: 'Parallel processing of the full context window is the key breakthrough that allowed transformers to scale on GPU clusters.'
                }
              ]
            },
            {
              id: 'wjZofJX0v4M-s2',
              order_index: 1,
              title: '2. High-Dimensional Word Embeddings & Direction Vectors',
              summary: 'How 12,288-dimensional embedding vectors capture semantic nuances, linguistic gender, geography, and conceptual relationships.',
              start_seconds: 440,
              end_seconds: 950,
              quiz_questions: [
                {
                  id: 'wjZofJX0v4M-q3',
                  question: 'In a typical frontier LLM (such as GPT-3), what is the dimensionality d_model of the token embedding vectors?',
                  options: [
                    '12,288 dimensions',
                    '3 dimensions (X, Y, Z)',
                    '28 dimensions',
                    '500,000 dimensions'
                  ],
                  correct_answer: '12,288 dimensions',
                  explanation: 'GPT-3 uses an embedding dimension of d_model = 12,288 to represent rich multi-faceted concepts.'
                },
                {
                  id: 'wjZofJX0v4M-q4',
                  question: 'How do semantic relationships manifest geometrically in high-dimensional embedding space?',
                  options: [
                    'As consistent displacement vectors (e.g. vector from Germany to Berlin matches France to Paris)',
                    'As completely random noise with zero correlation',
                    'As concentric circles on a 2D plane',
                    'As strictly perpendicular orthogonal coordinates'
                  ],
                  correct_answer: 'As consistent displacement vectors (e.g. vector from Germany to Berlin matches France to Paris)',
                  explanation: 'Semantic relationships correspond to directional offsets across the manifold.'
                }
              ]
            },
            {
              id: 'wjZofJX0v4M-s3',
              order_index: 2,
              title: '3. The Unembedding Matrix & Logits',
              summary: 'Mapping the final rich contextual vector back to vocabulary scores using the unembedding matrix W_u.',
              start_seconds: 950,
              end_seconds: 1350,
              quiz_questions: [
                {
                  id: 'wjZofJX0v4M-q5',
                  question: 'What is the purpose of the Unembedding Matrix (W_u) at the conclusion of a transformer?',
                  options: [
                    'It maps the final d_model dimensional vector back to a vector of logits with length equal to the vocabulary size (e.g. 50,000)',
                    'It deletes unused parameters to conserve VRAM',
                    'It converts English words into French translations',
                    'It compresses the text into a zip archive'
                  ],
                  correct_answer: 'It maps the final d_model dimensional vector back to a vector of logits with length equal to the vocabulary size (e.g. 50,000)',
                  explanation: 'The dot product between the final vector and each vocabulary row in W_u yields unnormalized log-probabilities (logits) for each word.'
                },
                {
                  id: 'wjZofJX0v4M-q6',
                  question: 'What are "Logits" before the application of Softmax?',
                  options: [
                    'Raw, unnormalized real-valued scores output by the final linear projection',
                    'Probabilities that strictly sum to 1.0',
                    'Binary flags indicating whether the sentence is grammatically correct',
                    'Integer counts of how many times a word appeared in training'
                  ],
                  correct_answer: 'Raw, unnormalized real-valued scores output by the final linear projection',
                  explanation: 'Logits can be any real number; they represent relative affinity prior to normalization.'
                }
              ]
            },
            {
              id: 'wjZofJX0v4M-s4',
              order_index: 3,
              title: '4. Softmax with Temperature Normalization',
              summary: 'Exponentiating logits, dividing by temperature T, and normalizing so that scores become a valid probability distribution.',
              start_seconds: 1350,
              end_seconds: 1613,
              quiz_questions: [
                {
                  id: 'wjZofJX0v4M-q7',
                  question: 'How does the Softmax function convert logits z_i into probabilities p_i?',
                  options: [
                    'p_i = exp(z_i / T) / ∑_j exp(z_j / T)',
                    'p_i = z_i / ∑_j z_j',
                    'p_i = z_i^2',
                    'p_i = log(z_i)'
                  ],
                  correct_answer: 'p_i = exp(z_i / T) / ∑_j exp(z_j / T)',
                  explanation: 'Softmax exponentiates scaled logits and normalizes by their sum, guaranteeing positive values that sum to 1.0.'
                },
                {
                  id: 'wjZofJX0v4M-q8',
                  question: 'As Temperature T approaches 0 in the Softmax formula, what happens to the output distribution?',
                  options: [
                    'The highest logit receives probability 1.0 while all other tokens drop to 0.0',
                    'Every token in the vocabulary receives an equal 1/N probability',
                    'The probabilities oscillate between positive and negative numbers',
                    'All output probabilities become NaN'
                  ],
                  correct_answer: 'The highest logit receives probability 1.0 while all other tokens drop to 0.0',
                  explanation: 'As T → 0, differences between exponents diverge exponentially, collapsing the distribution to an argmax single choice.'
                }
              ]
            }
          ]
        },
        {
          id: 'eMlx5fFNoYc',
          youtube_video_id: 'eMlx5fFNoYc',
          title: 'Attention in transformers, step-by-step | Deep Learning Chapter 6',
          channel: '3Blue1Brown',
          duration_seconds: 1570,
          thumbnail_url: 'https://img.youtube.com/vi/eMlx5fFNoYc/maxresdefault.jpg',
          chapter_number: 7,
          difficulty: 'Advanced',
          summary: 'The ultimate step-by-step visual breakdown of the Self-Attention mechanism: Queries, Keys, Values, Attention Matrices, Causal Masking, and Multi-Head projection.',
          status: 'ready',
          segments: [
            {
              id: 'eMlx5fFNoYc-s1',
              order_index: 0,
              title: '1. Why Attention? Contextual Polysemy',
              summary: 'How attention enables words like "bank" or "mole" to change their representations depending on surrounding tokens in the sentence.',
              start_seconds: 0,
              end_seconds: 380,
              quiz_questions: [
                {
                  id: 'eMlx5fFNoYc-q1',
                  question: 'What linguistic limitation of static word embeddings does the Self-Attention mechanism solve?',
                  options: [
                    'Polysemy: words with identical spelling have completely different meanings depending on contextual neighbors',
                    'The inability to store English punctuation marks',
                    'The lack of support for uppercase letters',
                    'The requirement for an internet connection during inference'
                  ],
                  correct_answer: 'Polysemy: words with identical spelling have completely different meanings depending on contextual neighbors',
                  explanation: 'In static embeddings, "bank" has one fixed vector. Self-attention updates "bank" toward financial or geological meanings depending on surrounding context.'
                },
                {
                  id: 'eMlx5fFNoYc-q2',
                  question: 'What is the primary conceptual role of an attention block in a transformer?',
                  options: [
                    'Allowing token vectors to communicate and pass information across the sequence',
                    'Translating code between Python and JavaScript',
                    'Compressing images into smaller bounding boxes',
                    'Calculating disk read/write bandwidth'
                  ],
                  correct_answer: 'Allowing token vectors to communicate and pass information across the sequence',
                  explanation: 'Self-attention is the communication protocol enabling each token to update its vector using information from other tokens in the context window.'
                }
              ]
            },
            {
              id: 'eMlx5fFNoYc-s2',
              order_index: 1,
              title: '2. Queries, Keys & Dot-Product Attention Scores',
              summary: 'How Query vectors (what a word asks for) and Key vectors (what a word advertises) compute alignment scores via dot products.',
              start_seconds: 380,
              end_seconds: 780,
              quiz_questions: [
                {
                  id: 'eMlx5fFNoYc-q3',
                  question: 'In the Query-Key-Value paradigm, what is the role of the Query (Q) vector?',
                  options: [
                    'It represents what the current token is looking for in other tokens across the sequence',
                    'It stores the final token to be printed on the screen',
                    'It acts as an encrypted password verification key',
                    'It contains the bias term added to the final layer'
                  ],
                  correct_answer: 'It represents what the current token is looking for in other tokens across the sequence',
                  explanation: 'A Query vector asks questions like: "Are there preceding adjectives describing me?" or "Where is my matching verb?"'
                },
                {
                  id: 'eMlx5fFNoYc-q4',
                  question: 'How is the raw attention score between token i and token j calculated?',
                  options: [
                    'By taking the dot product between Query_i and Key_j: (q_i · k_j) / √d_k',
                    'By subtracting Key_j from Query_i',
                    'By computing the Euclidean distance between their word spellings',
                    'By dividing the token index i by j'
                  ],
                  correct_answer: 'By taking the dot product between Query_i and Key_j: (q_i · k_j) / √d_k',
                  explanation: 'The dot product measures directional alignment between what token i seeks (Query) and what token j advertises (Key), scaled by √d_k.'
                }
              ]
            },
            {
              id: 'eMlx5fFNoYc-s3',
              order_index: 2,
              title: '3. Causal Masking & Value Vector Accumulation',
              summary: 'Applying lower-triangular causal masks so tokens cannot peek into future words, and weighting Value vectors by attention scores.',
              start_seconds: 780,
              end_seconds: 1160,
              quiz_questions: [
                {
                  id: 'eMlx5fFNoYc-q5',
                  question: 'Why is Causal (Autoregressive) Masking applied in generative decoder-only transformers like GPT?',
                  options: [
                    'To prevent tokens from attending to future tokens that have not yet been generated',
                    'To hide confidential training data from users',
                    'To mask out spelling errors in user prompts',
                    'To reduce the GPU memory bandwidth to zero'
                  ],
                  correct_answer: 'To prevent tokens from attending to future tokens that have not yet been generated',
                  explanation: 'Causal masking sets upper-triangle attention scores to -∞ before Softmax, ensuring token predictions depend only on past and present context.'
                },
                {
                  id: 'eMlx5fFNoYc-q6',
                  question: 'Once attention weights are normalized via Softmax, what vector is multiplied and summed to compute the attention output?',
                  options: [
                    'The Value (V) vectors of the attended tokens',
                    'The Query vectors of all future tokens',
                    'The positional indices of the words',
                    'The raw ASCII code of the text'
                  ],
                  correct_answer: 'The Value (V) vectors of the attended tokens',
                  explanation: 'Attention weights act as a blending recipe to compute a weighted sum of Value vectors: Output = ∑_j (Attention_ij · v_j).'
                }
              ]
            },
            {
              id: 'eMlx5fFNoYc-s4',
              order_index: 3,
              title: '4. Multi-Head Attention & Output Projection Matrices',
              summary: 'Splitting embeddings across multiple parallel attention heads (e.g. 96 heads) and recombining them through the output matrix W_o.',
              start_seconds: 1160,
              end_seconds: 1570,
              quiz_questions: [
                {
                  id: 'eMlx5fFNoYc-q7',
                  question: 'Why do modern transformers employ Multi-Head Attention instead of a single massive attention head?',
                  options: [
                    'It enables the model to simultaneously track multiple independent linguistic relationships (e.g. subject-verb, adjectives, pronoun antecedents)',
                    'Because GPUs are incapable of calculating matrices larger than 64 rows',
                    'To reduce the number of parameters in the model to zero',
                    'To allow multiple users to query the model at the same second'
                  ],
                  correct_answer: 'It enables the model to simultaneously track multiple independent linguistic relationships (e.g. subject-verb, adjectives, pronoun antecedents)',
                  explanation: 'Different attention heads specialize in distinct syntactic and semantic relationships in parallel.'
                },
                {
                  id: 'eMlx5fFNoYc-q8',
                  question: 'What is the role of the Output Matrix (W_o) at the end of a multi-head attention block?',
                  options: [
                    'It linearly projects concatenated outputs from all heads back into the model embedding dimension d_model',
                    'It prints the generated tokens to the terminal screen',
                    'It calculates the cross-entropy loss against the training labels',
                    'It resets all neuron activations to zero for the next prompt'
                  ],
                  correct_answer: 'It linearly projects concatenated outputs from all heads back into the model embedding dimension d_model',
                  explanation: 'The output projection W_o blends information across all specialized attention heads into a unified contextual vector.'
                }
              ]
            }
          ]
        },
        {
          id: '9-Jl0dxWQs8',
          youtube_video_id: '9-Jl0dxWQs8',
          title: 'How might LLMs store facts | Deep Learning Chapter 7',
          channel: '3Blue1Brown',
          duration_seconds: 1358,
          thumbnail_url: 'https://img.youtube.com/vi/9-Jl0dxWQs8/maxresdefault.jpg',
          chapter_number: 8,
          difficulty: 'Advanced',
          summary: 'Investigate mechanistic interpretability and how Multilayer Perceptrons (MLPs) act as associative key-value memory banks storing factual knowledge.',
          status: 'ready',
          segments: [
            {
              id: '9-Jl0dxWQs8-s1',
              order_index: 0,
              title: '1. The Factual Knowledge Storage Question',
              summary: 'Distinguishing between attention (communication between tokens) and MLPs (where world knowledge and associative facts reside).',
              start_seconds: 0,
              end_seconds: 320,
              quiz_questions: [
                {
                  id: '9-Jl0dxWQs8-q1',
                  question: 'In transformer architectures, where does research suggest factual knowledge (e.g. "Michael Jordan plays basketball") is predominantly stored?',
                  options: [
                    'Inside the weights of the Feed-Forward / Multilayer Perceptron (MLP) layers',
                    'Inside the static positional encoding vectors',
                    'In an external SQLite database query file',
                    'Inside the browser cache of the user'
                  ],
                  correct_answer: 'Inside the weights of the Feed-Forward / Multilayer Perceptron (MLP) layers',
                  explanation: 'While attention heads route information between tokens, feed-forward MLP layers act as associative memory networks storing factual knowledge.'
                },
                {
                  id: '9-Jl0dxWQs8-q2',
                  question: 'What is the fundamental difference in purpose between Attention layers and Feed-Forward (MLP) layers?',
                  options: [
                    'Attention moves information between tokens; MLPs process and enrich information within individual tokens independently',
                    'Attention handles punctuation, while MLPs handle vowel sounds',
                    'Attention runs on CPU, while MLPs run on GPU',
                    'Attention is only used during training, while MLPs are only used during inference'
                  ],
                  correct_answer: 'Attention moves information between tokens; MLPs process and enrich information within individual tokens independently',
                  explanation: 'Attention enables token-to-token communication; MLPs compute non-linear feature representations for each token position independently.'
                }
              ]
            },
            {
              id: '9-Jl0dxWQs8-s2',
              order_index: 1,
              title: '2. MLPs as Key-Value Associative Memories',
              summary: 'How the two weight matrices W_gate/W_up and W_down function like a dictionary lookup: keys detect concepts, values inject factual updates.',
              start_seconds: 320,
              end_seconds: 800,
              quiz_questions: [
                {
                  id: '9-Jl0dxWQs8-q3',
                  question: 'How can the first layer of an MLP be interpreted mechanically?',
                  options: [
                    'As a bank of "Keys" or pattern detectors that activate when a specific concept or subject is detected in the token vector',
                    'As an image compression algorithm',
                    'As an input randomizer to prevent hacking',
                    'As a text-to-speech frequency synthesizer'
                  ],
                  correct_answer: 'As a bank of "Keys" or pattern detectors that activate when a specific concept or subject is detected in the token vector',
                  explanation: 'The first matrix acts as key detectors: if the input aligns with a key direction, the corresponding neuron fires with high activation.'
                },
                {
                  id: '9-Jl0dxWQs8-q4',
                  question: 'What does the second weight matrix of the MLP do with the activated neurons?',
                  options: [
                    'It adds associated "Value" vectors to the residual stream containing factual properties or next-word directions',
                    'It zeroes out all activations to clear memory',
                    'It sends an HTTP webhook request to the server',
                    'It prints the word directly to output'
                  ],
                  correct_answer: 'It adds associated "Value" vectors to the residual stream containing factual properties or next-word directions',
                  explanation: 'The second layer acts as value retrieval: firing neurons write corresponding value vectors back into the residual stream.'
                }
              ]
            },
            {
              id: '9-Jl0dxWQs8-s3',
              order_index: 2,
              title: '3. Superposition & High-Dimensional Storage Capacity',
              summary: 'How neural networks represent more concepts than available neurons by utilizing almost-orthogonal directions in high dimensions.',
              start_seconds: 800,
              end_seconds: 1358,
              quiz_questions: [
                {
                  id: '9-Jl0dxWQs8-q5',
                  question: 'What is the phenomenon of "Superposition" in neural network representations?',
                  options: [
                    'Storing more distinct conceptual features than there are neurons by allocating non-orthogonal, nearly-independent directions',
                    'Running multiple models on the same motherboard simultaneously',
                    'Overlapping two images on top of each other in Photoshop',
                    'Stacking multiple GPU cards in a single server rack'
                  ],
                  correct_answer: 'Storing more distinct conceptual features than there are neurons by allocating non-orthogonal, nearly-independent directions',
                  explanation: 'High-dimensional spaces can pack exponentially many almost-orthogonal vectors, allowing networks to encode thousands of sparse features in fewer neurons.'
                },
                {
                  id: '9-Jl0dxWQs8-q6',
                  question: 'What property of high dimensions makes superposition mathematically viable with minimal interference?',
                  options: [
                    'In high-dimensional spaces (e.g. 10,000D), randomly chosen vectors are almost certainly nearly orthogonal (dot product ≈ 0)',
                    'High dimensions eliminate all negative numbers',
                    'High dimensions make matrix multiplication unnecessary',
                    'High-dimensional spaces prevent overfitting'
                  ],
                  correct_answer: 'In high-dimensional spaces (e.g. 10,000D), randomly chosen vectors are almost certainly nearly orthogonal (dot product ≈ 0)',
                  explanation: 'Due to the geometry of high dimensions, random vectors have near-zero cosine similarity, preventing cross-talk between sparse features.'
                }
              ]
            }
          ]
        },
        {
          id: 'GlYgs6v2YfU',
          youtube_video_id: 'GlYgs6v2YfU',
          title: 'But what is cross-entropy? | Information theory, part 2',
          channel: '3Blue1Brown',
          duration_seconds: 2008,
          thumbnail_url: 'https://img.youtube.com/vi/GlYgs6v2YfU/maxresdefault.jpg',
          chapter_number: 9,
          difficulty: 'Advanced',
          summary: 'The information-theoretic foundations of Cross-Entropy loss, optimal bit compression, KL divergence, and why it is the gold standard training objective for LLMs.',
          status: 'ready',
          segments: [
            {
              id: 'GlYgs6v2YfU-s1',
              order_index: 0,
              title: '1. Information Theory, Surprise & Optimal Codes',
              summary: 'Measuring information in bits: why rare events convey high surprise (-log2 p) and how optimal coding minimizes expected message lengths.',
              start_seconds: 0,
              end_seconds: 450,
              quiz_questions: [
                {
                  id: 'GlYgs6v2YfU-q1',
                  question: 'In Claude Shannon’s Information Theory, how is the "Surprise" or information content of an event with probability p quantified?',
                  options: [
                    'I(p) = -log2(p)',
                    'I(p) = 1 - p',
                    'I(p) = p^2',
                    'I(p) = exp(p)'
                  ],
                  correct_answer: 'I(p) = -log2(p)',
                  explanation: 'The negative logarithm of probability reflects surprise: a certain event (p=1) carries 0 bits of surprise, while rare events carry high bits.'
                },
                {
                  id: 'GlYgs6v2YfU-q2',
                  question: 'What is Shannon Entropy H(P) of a probability distribution P?',
                  options: [
                    'The average expected surprise: H(P) = -∑ p_i · log2(p_i)',
                    'The maximum probability value in the distribution',
                    'The standard deviation of the dataset divided by two',
                    'The count of unique vocabulary words in a sentence'
                  ],
                  correct_answer: 'The average expected surprise: H(P) = -∑ p_i · log2(p_i)',
                  explanation: 'Entropy measures the fundamental minimum average number of bits required to encode messages drawn from distribution P.'
                }
              ]
            },
            {
              id: 'GlYgs6v2YfU-s2',
              order_index: 1,
              title: '2. Defining Cross-Entropy: True vs Model Distributions',
              summary: 'What happens when you encode events from distribution P using an imperfect code optimized for model distribution Q.',
              start_seconds: 450,
              end_seconds: 900,
              quiz_questions: [
                {
                  id: 'GlYgs6v2YfU-q3',
                  question: 'What does Cross-Entropy H(P, Q) measure in machine learning?',
                  options: [
                    'The average code length in bits when the true distribution is P but we use the predicted distribution Q to construct our code',
                    'The total electrical power consumed by training GPUs',
                    'The similarity between two image pixel arrays',
                    'The speed of backpropagation convergence in seconds'
                  ],
                  correct_answer: 'The average code length in bits when the true distribution is P but we use the predicted distribution Q to construct our code',
                  explanation: 'Cross-entropy equals H(P, Q) = -∑ p_i log(q_i); it penalizes models that assign low probability to true outcomes.'
                },
                {
                  id: 'GlYgs6v2YfU-q4',
                  question: 'When the model distribution Q perfectly matches the true distribution P, what does cross-entropy H(P, Q) equal?',
                  options: [
                    'It equals the true entropy H(P), reaching its theoretical minimum',
                    'It equals 0.0 under all conditions',
                    'It becomes negative infinity',
                    'It becomes undefined'
                  ],
                  correct_answer: 'It equals the true entropy H(P), reaching its theoretical minimum',
                  explanation: 'Cross-entropy is always greater than or equal to true entropy; equality holds if and only if Q = P.'
                }
              ]
            },
            {
              id: 'GlYgs6v2YfU-s3',
              order_index: 2,
              title: '3. Why Cross-Entropy is the Standard LLM Loss',
              summary: 'For a one-hot training target (p_target = 1), cross-entropy simplifies to -log(q_target), providing smooth, steep gradients for gradient descent.',
              start_seconds: 900,
              end_seconds: 1450,
              quiz_questions: [
                {
                  id: 'GlYgs6v2YfU-q5',
                  question: 'In language modeling where the ground-truth next token has probability 1, what does the cross-entropy loss reduce to?',
                  options: [
                    'Loss = -log(q_target), where q_target is the probability the model assigned to the correct token',
                    'Loss = (1 - q_target)^2',
                    'Loss = q_target / 100',
                    'Loss = log(1 + q_target)'
                  ],
                  correct_answer: 'Loss = -log(q_target), where q_target is the probability the model assigned to the correct token',
                  explanation: 'Since all other p_i are 0, only the correct token contributes to the sum, penalizing the model whenever q_target is small.'
                },
                {
                  id: 'GlYgs6v2YfU-q6',
                  question: 'Why is Cross-Entropy preferred over Mean Squared Error (MSE) for training classification models and LLMs?',
                  options: [
                    'Because -log(q) produces steep gradients that prevent gradient saturation when the model makes confident incorrect predictions',
                    'Because MSE cannot be computed with floating-point numbers',
                    'Because Cross-Entropy requires fewer GPU memory bytes',
                    'Because Cross-Entropy guarantees zero training epochs'
                  ],
                  correct_answer: 'Because -log(q) produces steep gradients that prevent gradient saturation when the model makes confident incorrect predictions',
                  explanation: 'MSE gradients vanish when sigmoid/softmax outputs saturate near 0 or 1, whereas cross-entropy derivative produces strong learning signals (q - y).'
                }
              ]
            },
            {
              id: 'GlYgs6v2YfU-s4',
              order_index: 3,
              title: '4. KL Divergence & Knowledge Distillation',
              summary: 'Understanding Relative Entropy (Kullback-Leibler divergence) as the excess bits wasted, and how student models learn from teacher distributions.',
              start_seconds: 1450,
              end_seconds: 2008,
              quiz_questions: [
                {
                  id: 'GlYgs6v2YfU-q7',
                  question: 'What is the relationship between Cross-Entropy H(P, Q), True Entropy H(P), and KL Divergence D_KL(P || Q)?',
                  options: [
                    'H(P, Q) = H(P) + D_KL(P || Q)',
                    'H(P, Q) = H(P) · D_KL(P || Q)',
                    'H(P, Q) = D_KL(P || Q) - H(P)',
                    'H(P, Q) = H(P) / D_KL(P || Q)'
                  ],
                  correct_answer: 'H(P, Q) = H(P) + D_KL(P || Q)',
                  explanation: 'Cross-entropy is the sum of the inherent entropy of the data plus the excess divergence (KL divergence) caused by approximating P with Q.'
                },
                {
                  id: 'GlYgs6v2YfU-q8',
                  question: 'In Model Distillation, how is KL divergence utilized between the Teacher and Student models?',
                  options: [
                    'To train the smaller student model to match the full soft probability distribution of the large teacher model',
                    'To delete 90% of the teacher model weights permanently',
                    'To encrypt the student weights using SSL certificates',
                    'To convert the model into a hardware FPGA circuit'
                  ],
                  correct_answer: 'To train the smaller student model to match the full soft probability distribution of the large teacher model',
                  explanation: 'Minimizing KL divergence between student and teacher distributions transfers the rich knowledge embedded in non-target token probabilities.'
                }
              ]
            }
          ]
        },
        {
          id: 'iv-5mZ_9CPY',
          youtube_video_id: 'iv-5mZ_9CPY',
          title: 'But how do AI images and videos actually work? | Guest video by Welch Labs',
          channel: '3Blue1Brown',
          duration_seconds: 2220,
          thumbnail_url: 'https://img.youtube.com/vi/iv-5mZ_9CPY/maxresdefault.jpg',
          chapter_number: 10,
          difficulty: 'Advanced',
          summary: 'A visual masterpiece on Multimodal Generative AI: text-image shared embeddings with CLIP, Denoising Diffusion Probabilistic Models (DDPM), score matching, and classifier-free guidance.',
          status: 'ready',
          segments: [
            {
              id: 'iv-5mZ_9CPY-s1',
              order_index: 0,
              title: '1. Multimodal Alignment & The Shared CLIP Embedding Space',
              summary: 'How contrastive pre-training aligns text captions and visual pixel features into a single continuous geometric embedding space.',
              start_seconds: 0,
              end_seconds: 450,
              quiz_questions: [
                {
                  id: 'iv-5mZ_9CPY-q1',
                  question: 'What is the core breakthrough of OpenAI’s CLIP (Contrastive Language-Image Pre-training)?',
                  options: [
                    'It trains a text encoder and image encoder jointly so that matching image-text pairs have high cosine similarity in a shared vector space',
                    'It generates high-resolution JPEG images directly from audio microphones',
                    'It compresses video files by 99% without loss of fidelity',
                    'It replaces transformer attention with Fourier transforms'
                  ],
                  correct_answer: 'It trains a text encoder and image encoder jointly so that matching image-text pairs have high cosine similarity in a shared vector space',
                  explanation: 'Contrastive learning forces images and their descriptive texts to map to nearly identical vector coordinates in a shared multimodal space.'
                },
                {
                  id: 'iv-5mZ_9CPY-q2',
                  question: 'In contrastive training with an N x N batch of image-text pairs, how many negative pairs are contrasted against the N positive diagonal pairs?',
                  options: [
                    'N^2 - N negative pairs',
                    'N negative pairs',
                    '0 negative pairs',
                    '2N negative pairs'
                  ],
                  correct_answer: 'N^2 - N negative pairs',
                  explanation: 'The diagonal contains matching pairs, while all off-diagonal entries (N^2 - N) serve as negative contrasts.'
                }
              ]
            },
            {
              id: 'iv-5mZ_9CPY-s2',
              order_index: 1,
              title: '2. Denoising Diffusion Probabilistic Models (DDPM)',
              summary: 'The forward noise diffusion process and training a U-Net neural network to predict and remove Gaussian noise step-by-step.',
              start_seconds: 450,
              end_seconds: 1100,
              quiz_questions: [
                {
                  id: 'iv-5mZ_9CPY-q3',
                  question: 'What occurs during the Forward Process of a Diffusion Model?',
                  options: [
                    'Gaussian noise is iteratively added to an image across hundreds of timesteps until it turns into pure random static',
                    'The neural network predicts the English caption of the image',
                    'The image resolution is upscaled using bicubic interpolation',
                    'The image colors are inverted into negative film'
                  ],
                  correct_answer: 'Gaussian noise is iteratively added to an image across hundreds of timesteps until it turns into pure random static',
                  explanation: 'The forward Markov process gradually destroys image structure by adding Gaussian noise according to a predefined variance schedule.'
                },
                {
                  id: 'iv-5mZ_9CPY-q4',
                  question: 'What task is the U-Net neural network trained to perform during the reverse generation process?',
                  options: [
                    'Predict the exact noise component ε that was added at timestep t, allowing it to be subtracted',
                    'Memorize training images pixel by pixel',
                    'Classify whether the image contains a cat or a dog',
                    'Convert the image into an SVG vector outline'
                  ],
                  correct_answer: 'Predict the exact noise component ε that was added at timestep t, allowing it to be subtracted',
                  explanation: 'By predicting the noise vector added at timestep t, the model subtracts it to recover a slightly cleaner intermediate image.'
                }
              ]
            },
            {
              id: 'iv-5mZ_9CPY-s3',
              order_index: 2,
              title: '3. Vector Fields, Score Matching & DDIM Samplers',
              summary: 'Viewing diffusion as traversing a high-dimensional vector field pointing toward the natural image manifold, accelerated by deterministic ODE samplers.',
              start_seconds: 1100,
              end_seconds: 1650,
              quiz_questions: [
                {
                  id: 'iv-5mZ_9CPY-q5',
                  question: 'What does the Score Function ∇_x log p(x) represent geometrically in diffusion models?',
                  options: [
                    'A vector field in pixel space pointing in the direction of increasing probability of natural, realistic images',
                    'The user satisfaction rating from 1 to 10',
                    'The number of frames rendered per second by the graphics card',
                    'The total count of colors in the color palette'
                  ],
                  correct_answer: 'A vector field in pixel space pointing in the direction of increasing probability of natural, realistic images',
                  explanation: 'Score matching estimates the gradient of the log probability density, guiding noisy points toward high-density image clusters.'
                },
                {
                  id: 'iv-5mZ_9CPY-q6',
                  question: 'How do accelerated samplers like DDIM (Denoising Diffusion Implicit Models) differ from standard DDPM?',
                  options: [
                    'They formulate the reverse trajectory as a deterministic Ordinary Differential Equation (ODE), generating images in 20-50 steps instead of 1,000',
                    'They require training a new neural network from scratch for every prompt',
                    'They only work with grayscale black and white images',
                    'They delete the text prompt before generation begins'
                  ],
                  correct_answer: 'They formulate the reverse trajectory as a deterministic Ordinary Differential Equation (ODE), generating images in 20-50 steps instead of 1,000',
                  explanation: 'DDIM uses a non-Markovian deterministic ODE trajectory that can take large numerical strides, cutting generation time dramatically.'
                }
              ]
            },
            {
              id: 'iv-5mZ_9CPY-s4',
              order_index: 3,
              title: '4. Cross-Attention Conditioning & Classifier-Free Guidance',
              summary: 'Injecting text prompt embeddings into the U-Net via cross-attention and scaling prompt fidelity using Classifier-Free Guidance (CFG).',
              start_seconds: 1650,
              end_seconds: 2220,
              quiz_questions: [
                {
                  id: 'iv-5mZ_9CPY-q7',
                  question: 'How does text-conditioning steer image generation in models like Stable Diffusion or DALL-E?',
                  options: [
                    'Text embeddings serve as Keys and Values in Cross-Attention layers inside the image U-Net denoising blocks',
                    'The text is pasted onto the pixels as a watermark',
                    'The prompt is hashed into an MD5 integer seed',
                    'The model generates text first, then screenshots the font'
                  ],
                  correct_answer: 'Text embeddings serve as Keys and Values in Cross-Attention layers inside the image U-Net denoising blocks',
                  explanation: 'In cross-attention, spatial image features act as Queries while text token embeddings act as Keys and Values, steering denoising toward prompt concepts.'
                },
                {
                  id: 'iv-5mZ_9CPY-q8',
                  question: 'What is the purpose of Classifier-Free Guidance (CFG) scale in diffusion generation?',
                  options: [
                    'It extrapolates away from the unconditional (empty prompt) prediction toward the conditioned prediction: ε_guided = ε_uncond + s · (ε_cond - ε_uncond)',
                    'It classifies whether the user prompt violates copyright policies',
                    'It restricts generation strictly to photorealistic styles',
                    'It limits the image file size to under 2 megabytes'
                  ],
                  correct_answer: 'It extrapolates away from the unconditional (empty prompt) prediction toward the conditioned prediction: ε_guided = ε_uncond + s · (ε_cond - ε_uncond)',
                  explanation: 'CFG amplifies adherence to the prompt by stepping further in the direction of the conditioned noise estimate relative to the unconditional baseline.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

/**
 * Helper to lookup any video in the Vertex GDNA course by its YouTube ID or internal ID.
 */
export function getVertexGdnaVideo(idOrYoutubeId: string): CourseVideo | undefined {
  for (const mod of VERTEX_GDNA_COURSE.modules) {
    const found = mod.videos.find(
      (v) => v.id === idOrYoutubeId || v.youtube_video_id === idOrYoutubeId
    );
    if (found) return found;
  }
  return undefined;
}

/**
 * Helper to retrieve all videos in the Vertex GDNA course
 */
export function getAllVertexGdnaVideos(): CourseVideo[] {
  return VERTEX_GDNA_COURSE.modules.flatMap((m) => m.videos);
}
