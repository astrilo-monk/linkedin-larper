export const myPosts = [
  `so i've been working on Code Tracer, it traces through your code and explains what's happening. one feature was showing time and space complexity.

the problem? it was just prompting Groq's LLaMA 70B to guess the Big-O. it worked sometimes but would hallucinate, contradict itself, and you couldn't trust it. an LLM guessing isn't analyzing.

so i built an actual analyzer that walks the code structurally instead.

the stack and why:
- Node.js (ESM) - Code Tracer is already JS, so this plugs in directly as a module
- Tree-sitter - parses C, C++, Java, Python with the same API. real syntax tree, not regex
- Custom IR - 12 node types that all languages normalize into. write analysis once, works on everything
- Vitest - fast, works with ESM out of the box

what it does:
4 analyzers run over the IR:
- loop analyzer (O(n), O(log n), O(√n), nested loops)
- recursion analyzer (fibonacci, merge sort, binary search, applies the master theorem)
- space analyzer (malloc, arrays, recursion stack depth)
- pattern detector (labels code as "binary search", "backtracking", "two-pointer", etc.)

every result comes with a confidence score and step-by-step reasoning

bugs that humbled me:
- malloc(n * sizeof(int)) was classified as O(n²). analyzer saw the * and thought two variables multiplied. had to strip away malloc, sizeof, casts to extract the actual size variable

- fast exponentiation showed O(2^n). function calls f(n/2) in one branch and f(n-1) in the other but they're exclusive if/else. analyzer saw 2 calls and assumed both run. actual answer: O(log n)

- sliding window reasoning proved O(n²) then said "answer: O(n)". the explanation contradicted the result. if your proof is wrong nobody should trust your tool

where it stands:
200+ tests passing. handles most textbook algorithms. 4 languages. zero API keys. fully offline.

where i'm stuck:
this is where my brain maxes out. graph algorithms break it. amortized analysis is barely there. DP patterns, complex state transitions, i don't know where to start.

i built what i could. learned a ton. but this can be so much more than what i can make alone.

so i'm open sourcing it. if you're into compilers, static analysis, or algorithms i'd love help. adding patterns, fixing my mistakes, roasting my IR design. all welcome.

repo link - https://lnkd.in/d4r7q4MN`,

  `It's a very good day to be a Python developer.

I’ve been building CodeTracer that helps developers see exactly what their code is doing line-by-line. To benchmark the performance of the tracing engine, I ran the classic "Koko Eating Bananas" DSA problem to see how long it takes to generate a full step-by-step execution trace across different languages.

The performance gap was massive: C: ~83 seconds Java: ~32 seconds Python: < 2 seconds

The difference comes down to architecture. For C and Java, the backend has to spin up an external debugger process (GDB or JDB), send text commands over standard input, wait for the response, and parse the complex string output for every single step of execution. The overhead of inter-process communication and string parsing creates a huge bottleneck.
For Python, I was able to use the built-in sys.settrace API. The tracer runs natively inside the exact same process as the code being evaluated. There's no IPC, no string-parsing, and no ahead-of-time compilation. The engine just pulls the frame.f_locals dictionary straight from memory and flies through the execution tree.

Python is officially the fastest option on the platform right now. 

Currently it still breaks if not providing a main function to both C and Java and if needed user input to run the code. Try it yourself:

Live Link - https://lnkd.in/gJZ_3F2b
Guide - https://lnkd.in/gHwy9zqu`,

  `A month ago I posted about C Trace — a tool that lets you watch C code execute step by step, variable by variable, through GDB.

It's grown a bit since then.

Java support is in. Same experience — paste code, watch it run line by line, see the call stack update, see variables change. Getting there was messier than C because GDB has a proper machine interface protocol. JDB just dumps plain text. Inconsistent formatting, varies by JDK version. Lot of regex. But it works.

The AI tutor went from local Ollama to Groq's Llama 3.3 70B. And the key thing I wanted to get right: it doesn't just see your source code. Before the model gets called, the backend builds a trace summary — which lines executed most, where loops iterated backward (backedge detection), how variables evolved across steps, whether there's recursion in the call stack. So the AI has both your code and your actual runtime behavior. When it tells you why something runs five times, it actually knows.

Three AI features now: a chat window, Big-O complexity estimation with a confidence score, and a one-click plain-English explanation of your code.

The core tracing engine is the same idea as before: inject breakpoints on every executable line, pull frame data at each stop, serialize to JSON, scrub through execution like a video. That part just works now for two languages instead of one.

Stack: React + Monaco + Zustand + React Flow on the front. FastAPI + PyGDBMI on the back. Docker sandbox for isolation. Deployed on Vercel and Render.

Not open source anymore. 

Try it: https://lnkd.in/gJZ_3F2b
Guide: https://lnkd.in/gHwy9zqu

Still updating and working on it. And would love to know what breaks.`,

  `Built C Trace: an interactive code execution tracker that lets you watch C programs run step-by-step, variable by variable.

Instead of mentally tracing through code or debugging blindly, you paste C code and watch the stack and heap update in real time. Memory addresses, local variables, call stack, all visual. There's also a local AI tutor (via Ollama) that guides you through problems without spoiling answers.

The technical challenge was getting live execution data out of GDB and syncing it to a React frontend fast enough to feel instant. Solved that with pygdbmi for breakpoint-based tracing and JSON serialization. Injecting breakpoints on every executable line, pulling frame data at each stop, and letting users scrub through execution like a video.

Frontend is React 18 with Tailwind and Monaco Editor. Backend is FastAPI with Python. The tracer itself is GCC and GDB doing the heavy lifting.

It's open source on GitHub. If you're learning C or teaching it, this thing actually shows you what's happening instead of making you guess.

github : https://lnkd.in/dFvt6PDP

(note: Currently working on a Cpp and Java version and frontend if fully vibe coded 😛)`,

  `you might not know it but i'm the most goated person you will EVER hire`
];
