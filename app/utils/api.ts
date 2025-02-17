import pako from 'pako';

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const PLANTUML_SERVER = "https://www.plantuml.com/plantuml";

function encodePlantUML(text: string): string {
  const encode64 = (data: number) => {
    const table = 
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
    return table.charAt(data & 0x3F);
  };

  const data = new TextEncoder().encode(text);
  
  // Compress using pako
  const compressed = pako.deflate(data);

  let result = "";
  for (let i = 0; i < compressed.length; i += 3) {
    const b1 = compressed[i];
    const b2 = i + 1 < compressed.length ? compressed[i + 1] : 0;
    const b3 = i + 2 < compressed.length ? compressed[i + 2] : 0;
    
    result += encode64(b1 >> 2);
    result += encode64(((b1 & 0x3) << 4) | (b2 >> 4));
    result += encode64(((b2 & 0xF) << 2) | (b3 >> 6));
    result += encode64(b3 & 0x3F);
  }

  return result;
}

export type DiagramType = 'usecase' | 'class' | 'sequence' | 'activity' | 'component';
export type DetailLevel = 'basic' | 'intermediate' | 'detailed';

type PromptMap = {
  [K in DetailLevel]: {
    [T in DiagramType]: string;
  };
};

// Add these types for better type safety
type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message: string;
    type: string;
  };
};

export async function generateUMLFromText(
  description: string, 
  diagramType: DiagramType, 
  detailLevel: DetailLevel = 'basic',
  model: string = 'deepseek/deepseek-r1:free',
  temperature: number = 0.7,
  maxTokens: number = 1024
) {
  const prompts: PromptMap = {
    basic: {
      usecase: `You are a UML expert. Create a basic use case diagram with:
        1. Start with @startuml and end with @enduml
        2. Include 'left to right direction'
        3. One rectangle with system name
        4. 3-5 core use cases only
        5. Main actors (2-3) and basic relationships
        Only respond with PlantUML code.`,
      class: `You are a UML expert. Create a simple class diagram with:
        1. Start with @startuml and end with @enduml
        2. 5-7 main classes
        3. Basic attributes and methods
        4. Essential relationships only
        Only respond with PlantUML code.`,
      sequence: `You are a UML expert. Create a simple sequence diagram with:
        1. Start with @startuml and end with @enduml
        2. 5-7 main participants
        3. Basic message flow
        4. Simple interactions
        Only respond with PlantUML code.`,
      activity: `You are a UML expert. Create a simple activity diagram with:
        1. Start with @startuml and end with @enduml
        2. Start and end nodes
        3. 7-9 main activities
        4. Basic flow and decisions
        Only respond with PlantUML code.`,
      component: `You are a UML expert. Create a simple component diagram with:
        1. Start with @startuml and end with @enduml
        2. 5-7 main components
        3. Basic interfaces
        4. Essential dependencies
        Only respond with PlantUML code.`
    },

    intermediate: {
      usecase: `You are a UML expert. Create a moderately detailed use case diagram with:
        1. Start with @startuml and end with @enduml
        2. Include 'left to right direction'
        3. System boundary with descriptive name
        4. 5-7 core use cases
        5. Main actors and relationships
        6. Essential <<include>> relationships
        7. Basic layout optimization
        Only respond with PlantUML code.`,
      class: `You are a UML expert specializing in Class diagrams. Follow these rules strictly:
        1. Start with @startuml and end with @enduml
        2. Class definition:
           - Use 'class ClassName'
           - List attributes with proper visibility (+, -, #)
           - List methods with parameters and return types
        3. Relationships:
           - Inheritance: --|>
           - Association: --
           - Aggregation: o--
           - Composition: *--
        4. Include multiplicity where relevant (1..*, 0..1, etc.)
        Only respond with valid PlantUML code, no explanations.`,
      sequence: `You are a UML expert specializing in Sequence diagrams. Follow these rules strictly:
        1. Start with @startuml and end with @enduml
        2. Participant definition:
           - Define all participants at the start
           - Use appropriate stereotypes (actor, boundary, control, entity)
        3. Messages:
           - Synchronous: ->
           - Asynchronous: ->>
           - Return: -->
        4. Use activation boxes with activate/deactivate
        5. Use alt/loop/opt for conditional flows
        Only respond with valid PlantUML code, no explanations.`,
      activity: `You are a UML expert specializing in Activity diagrams. Follow these rules strictly:
        1. Start with @startuml and end with @enduml
        2. Use proper start/end nodes:
           - start
           - stop/end
        3. Activities:
           - Use ':action description;'
           - Group related activities
        4. Decision nodes:
           - if/else conditions
           - Use diamond syntax
        5. Fork/Join for parallel activities
        6. Swimlanes for different actors/systems
        Only respond with valid PlantUML code, no explanations.`,
      component: `You are a UML expert specializing in Component diagrams. Follow these rules strictly:
        1. Start with @startuml and end with @enduml
        2. Component definition:
           - Use [Component Name]
           - Or component "Name" as compId
        3. Interfaces:
           - Use interface or ball/socket notation
           - Define required and provided interfaces
        4. Use proper stereotypes
        5. Show dependencies with -->
        Only respond with valid PlantUML code, no explanations.`
    },

    detailed: {
      usecase: `You are a UML expert specializing in Use Case diagrams. Follow these rules strictly:
        1. Start with @startuml and end with @enduml
        2. Always include 'left to right direction'
        3. Actor definition:
           - Use 'actor "Actor Name" as actorId'
           - Place primary actors on the left
           - Place secondary actors on the right
        4. System boundary:
           - Always define a rectangle with system name
           - Place all use cases inside the rectangle
        5. Use case definition:
           - Use 'usecase "Use Case Name" as ucId'
           - Keep names short and action-oriented
        6. Relationships:
           - Actor to use case: actor --> usecase
           - Include: usecase ..> usecase : <<include>>
           - Extend: usecase ..> usecase : <<extend>>
        7. Layout:
           - Group related use cases together
           - Minimize crossing lines
        Only respond with valid PlantUML code, no explanations.`,
      class: `You are a UML expert specializing in Class diagrams. Follow these rules strictly:
        1. Start with @startuml and end with @enduml
        2. Class definition:
           - Use 'class ClassName'
           - List attributes with proper visibility (+, -, #)
           - List methods with parameters and return types
        3. Relationships:
           - Inheritance: --|>
           - Association: --
           - Aggregation: o--
           - Composition: *--
        4. Include multiplicity where relevant (1..*, 0..1, etc.)
        Only respond with valid PlantUML code, no explanations.`,
      sequence: `You are a UML expert specializing in Sequence diagrams. Follow these rules strictly:
        1. Start with @startuml and end with @enduml
        2. Participant definition:
           - Define all participants at the start
           - Use appropriate stereotypes (actor, boundary, control, entity)
        3. Messages:
           - Synchronous: ->
           - Asynchronous: ->>
           - Return: -->
        4. Use activation boxes with activate/deactivate
        5. Use alt/loop/opt for conditional flows
        Only respond with valid PlantUML code, no explanations.`,
      activity: `You are a UML expert specializing in Activity diagrams. Follow these rules strictly:
        1. Start with @startuml and end with @enduml
        2. Use proper start/end nodes:
           - start
           - stop/end
        3. Activities:
           - Use ':action description;'
           - Group related activities
        4. Decision nodes:
           - if/else conditions
           - Use diamond syntax
        5. Fork/Join for parallel activities
        6. Swimlanes for different actors/systems
        Only respond with valid PlantUML code, no explanations.`,
      component: `You are a UML expert specializing in Component diagrams. Follow these rules strictly:
        1. Start with @startuml and end with @enduml
        2. Component definition:
           - Use [Component Name]
           - Or component "Name" as compId
        3. Interfaces:
           - Use interface or ball/socket notation
           - Define required and provided interfaces
        4. Use proper stereotypes
        5. Show dependencies with -->
        Only respond with valid PlantUML code, no explanations.`
    }
  };

  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error('API key is not configured');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': `${process.env.NEXT_PUBLIC_WEBSITE_URL}`,
        'X-Title': 'UML Diagram Generator'
      },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [
          {
            role: 'system',
            content: prompts[detailLevel][diagramType]
          },
          {
            role: 'user',
            content: description
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data: OpenRouterResponse = await response.json();

    // Check for API error response
    if (data.error) {
      throw new Error(`API Error: ${data.error.message}`);
    }

    // Validate response structure
    if (!data.choices?.length || !data.choices[0]?.message?.content) {
      console.error('Invalid API response:', data);
      throw new Error('Invalid response from AI model');
    }

    let plantUMLCode = data.choices[0].message.content.trim();
    
    // Validate PlantUML code
    if (!plantUMLCode) {
      throw new Error('Empty response from AI model');
    }

    // Clean and validate the UML code
    if (!plantUMLCode.includes('@startuml') || !plantUMLCode.includes('@enduml')) {
      console.error('Invalid PlantUML code generated:', plantUMLCode);
      throw new Error('Generated diagram code is invalid');
    }

    // Clean up the code
    plantUMLCode = plantUMLCode
      .replace(/```plantuml\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^\s*@startuml\s*\n?/, '@startuml\n')
      .replace(/\s*@enduml\s*$/, '\n@enduml');

    const encoded = encodePlantUML(plantUMLCode);
    
    return {
      plantUMLCode,
      pngUrl: `${PLANTUML_SERVER}/png/~1${encoded}`,
      svgUrl: `${PLANTUML_SERVER}/svg/~1${encoded}`
    };
  } catch (error) {
    // Log the full error details for debugging
    console.error('Error generating UML diagram:', {
      error,
      description,
      diagramType,
      detailLevel,
      model
    });

    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Configuration error. Please check API settings.');
      }
      if (error.message.includes('API Error')) {
        throw new Error('AI service temporarily unavailable. Please try again later.');
      }
      if (error.message.includes('Invalid response') || error.message.includes('invalid')) {
        throw new Error('Unable to generate diagram. Please try a different description or model.');
      }
    }

    // Generic error for unexpected cases
    throw new Error('An unexpected error occurred. Please try again.');
  }
} 