import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

# Try to get available models
def get_available_model():
    """Get the first available model that supports generateContent"""
    try:
        # List available models
        for model_info in genai.list_models():
            if "generateContent" in model_info.supported_generation_methods:
                return model_info.name.split('/')[-1]  # Extract model name
    except Exception as e:
        print(f"Warning: Could not list models: {e}")
    
    # Fallback list of models to try
    models_to_try = [
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-pro',
        'gemini-pro-vision',
        'gemini-2.0-flash'
    ]
    
    for model_name in models_to_try:
        try:
            test_model = genai.GenerativeModel(model_name)
            print(f"✓ Using model: {model_name}")
            return model_name
        except Exception as e:
            print(f"✗ Model {model_name} not available: {str(e)[:50]}")
            continue
    
    return None

# Get available model
available_model = get_available_model()

if available_model:
    try:
        model = genai.GenerativeModel(available_model)
        print(f"Model initialized: {available_model}")
    except Exception as e:
        print(f"Error initializing model: {e}")
        model = None
else:
    print("No available Gemini model found. Using fallback mock responses.")
    model = None

def clean_response(text: str) -> str:
    """Clean special characters from API response"""
    import re
    # Remove $...$ patterns (mathematical notation)
    text = re.sub(r'\$[^$]*\$', '', text)
    # Replace #### with ###
    text = re.sub(r'#{4,}', '###', text)
    # Replace * bullet points with • 
    text = re.sub(r'\n\* ', '\n• ', text)
    # Remove excessive asterisks
    text = re.sub(r'\*\*', '', text)
    return text

def get_explanation(topic: str, difficulty: str):
    """Generate a real-time explanation using Gemini API or fallback"""
    try:
        if not model:
            return generate_mock_explanation(topic, difficulty)
        
        # Adjust prompt and tokens based on difficulty
        if difficulty.lower() == 'easy':
            prompt = f"""Provide a comprehensive explanation of '{topic}' at Easy level.

REQUIREMENTS:
- Write at least 1500 words (equivalent to half a page of dense text)
- Use simple, beginner-friendly language
- Start with a clear, simple definition
- Include 5-7 key concepts explained simply
- Provide 3-4 real-world examples
- Add a summary at the end
- Use bullet points and clear sections
- Avoid technical jargon

Structure:
1. Simple Definition (explain like to a 10-year-old)
2. Why it matters (real-world importance)
3. Key Concepts (5-7 points with examples)
4. Real-world Examples (3-4 detailed examples)
5. Common Misconceptions
6. Summary and Takeaways

Do NOT use mathematical symbols, dollar signs, or special characters."""
            max_tokens = 2500
            
        elif difficulty.lower() == 'medium':
            prompt = f"""Provide an in-depth explanation of '{topic}' at Medium level.

REQUIREMENTS:
- Write at least 2500-3000 words (equivalent to a full page)
- Use intermediate technical language
- Include detailed definition with context
- Explain 7-10 key concepts thoroughly
- Provide 4-5 practical examples with code/scenarios if applicable
- Include diagrams descriptions or algorithm explanations
- Add comparison tables or lists
- Discuss advantages and disadvantages
- Include a comprehensive summary

Structure:
1. Detailed Definition and Context
2. Historical Background or Evolution
3. Key Concepts and Principles (7-10 concepts)
4. Practical Examples and Use Cases (4-5 examples)
5. Advantages and Disadvantages
6. Common Patterns and Best Practices
7. Performance Considerations
8. Related Topics
9. Summary and Conclusion

Do NOT use mathematical symbols, dollar signs, or special characters."""
            max_tokens = 4000
            
        else:  # Hard
            prompt = f"""Provide an extremely comprehensive, advanced explanation of '{topic}' at Hard level.

REQUIREMENTS:
- Write at least 4000-5000 words (equivalent to 1.5-2 pages)
- Use advanced technical language suitable for experts
- Include formal definitions with theoretical context
- Explain 12-15 advanced concepts in depth
- Provide 6-8 complex examples with detailed analysis
- Include algorithm explanations, pseudocode, or detailed workflows
- Add comparison matrices and analysis tables
- Discuss theoretical frameworks and mathematical principles
- Include advanced use cases and edge cases
- Discuss performance analysis and complexity
- Include emerging trends and future directions
- Add implementation considerations and pitfalls

Structure:
1. Formal Definition and Mathematical Context
2. Historical Development and Evolution
3. Foundational Concepts (5-6 concepts)
4. Advanced Concepts and Theory (7-9 concepts)
5. Detailed Examples and Case Studies (6-8 examples)
6. Algorithm/Process Analysis
7. Performance Analysis and Optimization
8. Comparison with Alternatives
9. Implementation Strategies and Pitfalls
10. Advanced Use Cases and Edge Cases
11. Modern Approaches and Emerging Trends
12. Research and Future Directions
13. Best Practices and Recommendations
14. Conclusion and Critical Analysis

Make it detailed enough for a graduate-level course or technical interview preparation.
Do NOT use mathematical symbols, dollar signs, or special characters.
Use plain text formatting with clear headers and sections."""
            max_tokens = 7000

        response = model.generate_content(prompt, generation_config=genai.types.GenerationConfig(max_output_tokens=max_tokens))
        cleaned = clean_response(response.text)
        return cleaned
    except Exception as e:
        print(f"API Error: {e}")
        # Fallback to mock response
        return generate_mock_explanation(topic, difficulty)

def generate_mock_explanation(topic: str, difficulty: str):
    """Generate a mock explanation"""
    explanations = {
        "deadlock": {
            "Easy": f"""## Deadlock in Operating System (Easy Level)

### Simple Definition
A deadlock is a situation where two or more processes are stuck waiting for each other forever. Imagine two people trying to pass through a narrow door - each waiting for the other to move first, but neither can.

### Key Concepts
- **Mutual Exclusion**: Resources can only be used by one process at a time
- **Hold and Wait**: A process holds a resource while waiting for another
- **Circular Waiting**: Processes wait in a circle (A waits for B, B waits for A)

### Real-world Example
Two threads in a program:
- Thread A locks Resource 1 and waits for Resource 2
- Thread B locks Resource 2 and waits for Resource 1
Neither can proceed!

### Summary
Deadlock is when processes can't move forward because they're waiting for each other. It's a common problem in concurrent programs.""",
            "Medium": f"""## Deadlock in Operating System (Medium Level)

### Detailed Definition
A deadlock is a state where two or more processes are blocked indefinitely, each waiting for a resource held by another process in the set. This creates a circular dependency that cannot be resolved without external intervention.

### Four Necessary Conditions (Coffman Conditions)
- **Mutual Exclusion**: A resource cannot be shared; only one process can use it
- **Hold and Wait**: A process holding a resource can request additional resources
- **No Preemption**: Resources cannot be forcefully taken from a process
- **Circular Wait**: There exists a circular chain of processes, each holding resources needed by the next

### Example with Code Context
```
Thread A: lock(L1) → wait for L2
Thread B: lock(L2) → wait for L1
```
Result: Deadlock - both threads blocked indefinitely.

### Prevention Strategies
- Break one of the four conditions
- Use timeouts for lock acquisition
- Implement resource ordering
- Use deadlock detection algorithms

### Summary
Understanding deadlock is crucial for writing safe multithreaded applications. Prevention is better than detection.""",
            "Hard": f"""## Deadlock in Operating System - Advanced Analysis (Hard Level)

### I. Comprehensive Formal Definition

Deadlock is a situation in concurrent systems where a finite set of processes is blocked indefinitely. Each process holds at least one resource and waits for additional resources held by other processes in the set. This creates a situation where no process can proceed, and the system reaches a state of complete stagnation.

In technical terms, a deadlock state can be formally represented by:
- A set of processes: P1, P2, P3, ..., Pn
- A set of resources: R1, R2, R3, ..., Rm  
- A situation where each process Pi is waiting for a resource held by another process Pj in the same set
- No process outside this set can break the chain to help resolve the deadlock

From a graph perspective, deadlock corresponds to a cycle in the resource allocation graph where both processes and resources form a closed loop of dependencies.


### II. Coffman's Four Necessary Conditions for Deadlock

For deadlock to occur, ALL four conditions must be true simultaneously. If even one condition is false, deadlock cannot happen. These are known as the Coffman Conditions:

**Condition 1: Mutual Exclusion**
- A resource cannot be shared among multiple processes at the same time
- Only one process can use a resource at any given moment
- When one process uses the resource, all other processes must wait
- Example: A printer can only print one job at a time. If Process A is printing, Process B must wait.
- This is fundamental to how operating systems protect critical resources

**Condition 2: Hold and Wait**
- A process can hold some resources while waiting for other resources
- Once a process acquires a resource, it holds onto it while requesting additional resources
- The process does not release what it has until it gets what it needs
- Example: Thread A locks Mutex 1, then tries to acquire Mutex 2. While waiting for Mutex 2, Thread A still holds Mutex 1.
- This condition enables the circular dependencies that lead to deadlock

**Condition 3: No Preemption**
- Resources cannot be forcibly taken away from a process
- A resource is released only when the process voluntarily releases it
- The operating system cannot interrupt or steal resources from a process
- Example: If Thread A is holding a critical section lock, the OS cannot force Thread A to release it, even if another thread needs it urgently
- This prevents the OS from solving resource conflicts by force

**Condition 4: Circular Wait**
- A circular chain of processes exists where each process waits for a resource held by the next process
- Process 1 waits for a resource held by Process 2
- Process 2 waits for a resource held by Process 3
- ... and so on ...
- Process N waits for a resource held by Process 1, completing the cycle
- Example: P1 waits for R1 (held by P2), P2 waits for R2 (held by P1) - This forms a cycle


### III. Resource Allocation Graph (RAG) Modeling

The Resource Allocation Graph is a visual representation of the system state:

**Components of RAG:**
- **Process Nodes**: Represented as circles (P1, P2, P3, etc.)
- **Resource Nodes**: Represented as squares (R1, R2, R3, etc.)
- **Request Edges**: Arrow from process to resource (Process requests a resource)
- **Assignment Edges**: Arrow from resource to process (Resource is allocated to process)

**How to Detect Deadlock with RAG:**
- If the RAG contains a cycle, deadlock may exist
- For single-instance resources: A cycle definitely means deadlock
- For multiple-instance resources: A cycle is a warning sign but requires more analysis

**Practical Example:**
```
Process P1 holds Resource R1, requests Resource R2
Process P2 holds Resource R2, requests Resource R1

Visual representation:
P1 --holds--> R1
R1 <--requests-- P1

P2 --holds--> R2
R2 <--requests-- P2

This forms a cycle: P1 -> R2 -> P2 -> R1 -> P1
Result: DEADLOCK!
```


### IV. Deadlock Prevention - Breaking the Conditions

Prevention is the most direct approach. To prevent deadlock, eliminate at least ONE of the four Coffman conditions:

**Strategy 1: Break Mutual Exclusion**
- Make resources shareable whenever possible
- Use read-write locks for shared data (multiple readers, one writer)
- Create virtual resources (like spoolers for printers)
- Limitation: Not all resources can be shared (e.g., database records being modified)

**Strategy 2: Break Hold and Wait**
- Option A: Request all resources at once
  - Process must request all needed resources before starting execution
  - If not all available, process waits without holding any resources
  - Problem: Low resource utilization, processes wait longer
  
- Option B: Request one resource at a time
  - Process can only request one resource at a time
  - Must release current resource before requesting another
  - Problem: Complex to implement, potential for starvation

**Strategy 3: Break No Preemption**
- Allow the OS to take resources away from processes
- Save the process state for later restoration
- Works well for CPU and memory resources
- Problem: Not practical for I/O devices like printers or databases
- Implementation: Checkpointing and rollback mechanisms

**Strategy 4: Break Circular Wait**
- Impose a strict ordering on all resources
- All processes must request resources in the same predetermined order
- Example: Always request resources in order R1, then R2, then R3
- Never go backward in the ordering
- Effectiveness: Very effective if all processes follow the ordering
- Challenge: Requires careful system design and programmer discipline


### V. Deadlock Avoidance - Banker's Algorithm

The Banker's Algorithm is a famous strategy that prevents deadlock by ensuring the system never enters an unsafe state.

**Core Concept:**
- Before granting a resource request, check if it would lead to a safe state
- A safe state is one where all processes can eventually complete
- Only grant requests that maintain safety
- Deny requests that would create unsafe states

**Data Structures:**
- Available: How many resources are currently free
- Maximum: Maximum resources each process claims it will need
- Allocated: Resources currently allocated to each process
- Need: Remaining resources each process needs (Maximum - Allocated)

**Safety Algorithm:**
1. Check if granting the resource would make the system safe
2. Simulate releasing resources from completed processes
3. Check if all processes can eventually finish
4. If yes, grant the resource; if no, deny it

**Advantages:**
- Guarantees no deadlock will occur
- Better resource utilization than prevention

**Disadvantages:**
- Requires knowing maximum resource needs in advance
- High computational overhead (checking safety for each request)
- Not practical for systems with dynamic resource requirements


### VI. Deadlock Detection and Recovery

Instead of preventing deadlock, detect it when it occurs and recover from it.

**Detection Mechanisms:**

1. **Periodic Checking**: Check for deadlock at regular intervals
   - Run cycle detection on the resource allocation graph
   - Balance between detection latency and overhead

2. **Wait-for Graph Method**:
   - Simplified version of the resource allocation graph
   - Contains only processes, not resources
   - Process Pi -> Process Pj if Pi waits for a resource held by Pj
   - If a cycle exists in this graph, deadlock is present

3. **Resource Allocation Graph Reduction**:
   - Try to remove processes and resources from the graph
   - If the graph becomes empty, no deadlock exists
   - If processes remain, those processes are deadlocked

**Recovery Strategies:**

1. **Process Termination** (Most Common)
   - Abort the deadlocked processes
   - Option A: Abort all deadlocked processes at once (harsh but simple)
   - Option B: Abort processes one at a time until deadlock is broken
   - Considerations: Which process to abort? Priority? Loss of work?

2. **Resource Preemption**:
   - Take resources away from some processes
   - Reassign resources to other processes
   - Save state and rollback if needed
   - Problem: May cause loss of work, rollback overhead

3. **Combination Approach**:
   - Terminate low-priority processes
   - Preempt resources from non-critical operations
   - Minimize system impact and loss of work

**Recovery Challenges:**
- Which process(es) to sacrifice?
- How to handle partially completed work?
- How to restore system consistency?
- How to prevent repeated deadlock?


### VII. Real-World Examples

**Example 1: Database Transaction Deadlock**
```
Transaction A:
1. Lock Table Customers
2. Wait for Lock on Table Orders

Transaction B:
1. Lock Table Orders
2. Wait for Lock on Table Customers

Result: Both transactions are blocked, database detects and rolls back one transaction
```

**Example 2: Multithreaded Java Program**
```
Thread 1: lock(Account A) -> then try to lock(Account B)
Thread 2: lock(Account B) -> then try to lock(Account A)

Scenario:
- Thread 1 gets lock on Account A
- Thread 2 gets lock on Account B
- Thread 1 waits for lock on Account B (held by Thread 2)
- Thread 2 waits for lock on Account A (held by Thread 1)
-> DEADLOCK!

Solution: Always lock accounts in the same order (by ID)
```

**Example 3: Network Communication Deadlock**
```
Process A: Send message to B, wait for reply
Process B: Send message to A, wait for reply
Problem: Both are waiting for messages, none are being processed
Result: System hangs until timeout occurs
```


### VIII. Comparison of Deadlock Handling Strategies

**Prevention:**
- Pros: Guarantees no deadlock, simple to reason about
- Cons: Low resource utilization, high overhead
- Best for: Systems requiring absolute reliability

**Avoidance (Banker's Algorithm):**
- Pros: Better utilization than prevention, still guarantees safety
- Cons: High computational cost, needs advance knowledge of needs
- Best for: Systems with known resource requirements

**Detection and Recovery:**
- Pros: Allows higher resource utilization
- Cons: System must deal with deadlock after it occurs
- Best for: Systems where deadlock is rare

**Timeout-Based:**
- Pros: Simple to implement, works in distributed systems
- Cons: May not be reliable, recovery requires care
- Best for: Distributed systems where detection is difficult


### IX. Modern Approaches and Best Practices

**Modern Strategies:**
1. **Lock-Free Programming**: Use atomic operations instead of locks
2. **Resource Pooling**: Pre-allocate resources to avoid complex dependencies
3. **Timeout Mechanisms**: Set maximum wait times for resource acquisition
4. **Graph Monitoring**: Real-time monitoring of resource allocation graphs
5. **Machine Learning**: Predict and prevent deadlocks before they occur

**Best Practices for Developers:**
1. Use consistent resource ordering across all code
2. Always acquire locks in the same order
3. Hold locks for the minimum time necessary
4. Use try-lock with timeout instead of indefinite blocking
5. Design APIs that encourage safe patterns
6. Test thoroughly with concurrent scenarios
7. Use tools that detect potential deadlock conditions
8. Document resource acquisition order in code
9. Consider lock-free data structures when possible
10. Monitor and log resource usage in production

**Common Pitfalls to Avoid:**
- Nested locks in different orders
- Holding locks during I/O operations
- Recursive lock acquisition without careful handling
- Assuming deadlock won't happen in your code
- Ignoring compiler warnings about potential issues


### X. Summary and Key Takeaways

**Core Understanding:**
- Deadlock is a serious problem that must be addressed in system design
- It requires all four Coffman conditions to exist simultaneously
- Eliminating any one condition prevents deadlock

**Strategy Selection:**
- Prevention: Best for safety-critical systems
- Avoidance: Good balance but requires planning
- Detection: Practical when deadlock is unlikely
- Timeout: Simple for distributed systems

**Implementation Advice:**
- Choose one primary strategy based on your system needs
- Combine strategies for robustness
- Test thoroughly before deployment
- Monitor in production for unexpected deadlocks
- Be prepared with recovery procedures

**Fundamental Truth:**
Deadlock management is essential for building reliable concurrent systems. Understanding these mechanisms deeply is crucial for advanced systems programming and helps you write code that is both efficient and safe. The best approach is to prevent deadlock through careful design rather than trying to recover from it after it occurs."""
        },
        "class in java": {
            "Easy": "A class in Java is like a blueprint or template. Just like a cookie cutter creates many cookies of the same shape, a class defines the structure that objects will have. Classes contain properties (data) and methods (actions).",
            "Medium": "A class is a template for creating objects. It defines attributes (variables) and methods (functions) that describe what an object is and what it can do. Objects are instances created from the class blueprint.",
            "Hard": "A class is a user-defined data type that serves as a blueprint for object instantiation. It encapsulates data members (attributes) and member functions (methods), providing abstraction through access modifiers. Classes support inheritance, allowing code reuse through hierarchical relationships, and polymorphism through method overriding."
        }
    }
    
    topic_lower = topic.lower()
    
    # Find matching explanation
    for key in explanations:
        if key in topic_lower:
            level_explanations = explanations[key]
            return level_explanations.get(difficulty, level_explanations.get("Medium", f"Explanation for {topic} at {difficulty} level"))
    
    # Default fallback
    return f"## {topic} ({difficulty} Level)\n\nThis is an explanation of {topic} at {difficulty} difficulty level. To get the best learning experience, please ensure your API key has access to Gemini models, or try a different topic."

def get_summary(text: str):
    """Generate a real-time summary using Gemini API or fallback"""
    try:
        if not model:
            return generate_mock_summary(text)
            
        # Shortened prompt for faster response
        prompt = f"""Summarize this in 3-4 bullet points with key terms highlighted:

{text[:1000]}"""  # Limit input to first 1000 chars
        
        response = model.generate_content(prompt, generation_config=genai.types.GenerationConfig(max_output_tokens=300))
        return response.text
    except Exception as e:
        print(f"API Error: {e}")
        return generate_mock_summary(text)

def generate_mock_summary(text: str):
    """Generate a mock summary"""
    return f"""## Summary

### Key Points from Your Text
- **Main Concept**: The primary idea discussed in your material
- **Key Details**: Important supporting information  
- **Practical Application**: How this applies in real scenarios
- **Significance**: Why this matters to understand

### Important Terms (Highlighted in Your Text)
Based on your input of {len(text)} characters, the material covers important concepts that require careful study.

### Key Takeaways
1. Read through the material carefully to understand core principles
2. Identify key terms and concepts
3. Connect ideas to real-world applications
4. Practice with examples and exercises

### Next Steps
Review the key points, test your understanding, and practice applying these concepts to solidify your learning."""

def get_quiz(material: str, num_questions: int):
    """Generate real-time quiz questions using Gemini API or fallback"""
    try:
        if not model:
            return generate_mock_quiz(material, num_questions)
        
        # Limit questions to 3-5 for speed
        num_q = min(num_questions, 5)
        
        prompt = f"""Create {num_q} multiple-choice questions based on this:

{material[:500]}

Format each as:
Q1: [question]
A) [option] B) [option] C) [option] D) [option]
Ans: [A/B/C/D]"""
        
        response = model.generate_content(prompt, generation_config=genai.types.GenerationConfig(max_output_tokens=400))
        text = response.text
        
        # Parse the response into structured questions
        questions = parse_quiz_response(text, num_q)
        return questions
    except Exception as e:
        print(f"API Error: {e}")
        return generate_mock_quiz(material, num_questions)

def generate_mock_quiz(material: str, num_questions: int):
    """Generate mock quiz questions"""
    questions = []
    
    question_templates = [
        "What is the main concept discussed in the material?",
        "Which of the following best describes a key idea?",
        "According to the material, what is important?",
        "What can be inferred from the provided information?",
        "Which statement aligns with the material?",
    ]
    
    option_templates = [
        ("A concept from the material", "A related but different idea", "An opposite concept", "An unrelated topic"),
        ("A key point", "A secondary detail", "A common misconception", "A historical fact"),
        ("The main idea", "A supporting idea", "An alternative view", "An exception"),
        ("Correct understanding", "Partial understanding", "Misunderstanding", "Opposite meaning"),
        ("Essential concept", "Nice-to-know detail", "Common mistake", "Advanced topic"),
    ]
    
    for i in range(min(num_questions, 5)):
        template_idx = i % len(question_templates)
        options_idx = i % len(option_templates)
        
        questions.append({
            "question": question_templates[template_idx],
            "options": {
                "A": option_templates[options_idx][0],
                "B": option_templates[options_idx][1],
                "C": option_templates[options_idx][2],
                "D": option_templates[options_idx][3]
            },
            "correct_answer": "A"
        })
    
    return questions

def parse_quiz_response(response_text: str, num_questions: int):
    """Parse Gemini's quiz response into structured format"""
    questions = []
    
    try:
        # Split by question
        question_blocks = response_text.split("Question ")
        
        for block in question_blocks[1:]:  # Skip first empty split
            lines = block.strip().split('\n')
            if len(lines) < 5:
                continue
            
            # Extract question text
            question_line = lines[0].split(':', 1)
            if len(question_line) < 2:
                continue
            question_text = question_line[1].strip()
            
            # Extract options
            options = {}
            correct_answer = None
            
            for line in lines[1:]:
                line = line.strip()
                if line.startswith('A)') or line.startswith('A )'):
                    options['A'] = line[2:].strip()
                elif line.startswith('B)') or line.startswith('B )'):
                    options['B'] = line[2:].strip()
                elif line.startswith('C)') or line.startswith('C )'):
                    options['C'] = line[2:].strip()
                elif line.startswith('D)') or line.startswith('D )'):
                    options['D'] = line[2:].strip()
                elif 'Correct Answer:' in line:
                    correct_answer = line.split(':')[1].strip().upper()
            
            # Only add if we have all parts
            if question_text and len(options) == 4 and correct_answer:
                questions.append({
                    "question": question_text,
                    "options": options,
                    "correct_answer": correct_answer
                })
        
        # If parsing failed, return empty with message
        if not questions:
            # Fallback: create generic questions
            for i in range(1, num_questions + 1):
                questions.append({
                    "question": f"Question {i}: What is a key point from the material?",
                    "options": {
                        "A": "Option A",
                        "B": "Option B",
                        "C": "Option C",
                        "D": "Option D"
                    },
                    "correct_answer": "A"
                })
        
        return questions[:num_questions]
    except Exception as e:
        print(f"Error parsing quiz: {e}")
        return []

def get_flashcards(topic: str, num_cards: int):
    """Generate real-time flashcards using Gemini API or fallback"""
    try:
        if not model:
            return generate_mock_flashcards(topic, num_cards)
            
        prompt = f"""Create {num_cards} study flashcards about '{topic}'.

Format EXACTLY like this:
Card 1
Front: [Question or concept]
Back: [Answer or explanation]

Card 2
Front: [Question or concept]
Back: [Answer or explanation]

(repeat for all {num_cards} cards)

Make the flashcards educational and focused on key concepts."""
        
        response = model.generate_content(prompt)
        text = response.text
        
        # Parse the response into structured flashcards
        flashcards = parse_flashcards_response(text, num_cards)
        return flashcards
    except Exception as e:
        print(f"API Error: {e}")
        return generate_mock_flashcards(topic, num_cards)

def generate_mock_flashcards(topic: str, num_cards: int):
    """Generate mock flashcards"""
    flashcards = []
    
    flashcard_templates = [
        {
            "front": f"What is {topic.title()}?",
            "back": f"{topic.title()} is a fundamental concept in its field."
        },
        {
            "front": f"Key characteristics of {topic.title()}",
            "back": "It has multiple important aspects that define its nature."
        },
        {
            "front": f"How is {topic.title()} applied?",
            "back": f"{topic.title()} has practical applications in various scenarios."
        },
        {
            "front": f"Common misconceptions about {topic.title()}",
            "back": f"Many people misunderstand the true nature of {topic.title()}."
        },
        {
            "front": f"Why is {topic.title()} important?",
            "back": f"Understanding {topic.title()} is crucial for mastery in this field."
        },
    ]
    
    for i in range(min(num_cards, len(flashcard_templates))):
        flashcards.append({
            "id": i + 1,
            "front": flashcard_templates[i]["front"],
            "back": flashcard_templates[i]["back"]
        })
    
    return flashcards

def parse_flashcards_response(response_text: str, num_cards: int):
    """Parse Gemini's flashcard response into structured format"""
    flashcards = []
    
    try:
        # Split by card
        card_blocks = response_text.split("Card ")
        
        card_id = 0
        for block in card_blocks[1:]:  # Skip first empty split
            lines = block.strip().split('\n')
            if len(lines) < 2:
                continue
            
            front = None
            back = None
            
            for i, line in enumerate(lines):
                if line.strip().startswith('Front:'):
                    front = line.split(':', 1)[1].strip()
                elif line.strip().startswith('Back:'):
                    back = line.split(':', 1)[1].strip()
            
            if front and back:
                card_id += 1
                flashcards.append({
                    "id": card_id,
                    "front": front,
                    "back": back
                })
        
        return flashcards[:num_cards]
    except Exception as e:
        print(f"Error parsing flashcards: {e}")
        return []

