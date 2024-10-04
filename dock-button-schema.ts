/**
 * Exemplo de JSON Schema (em arquivo .ts) que descreve os tipos DockButton*.
 */
 export default {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "DockButtonSchema",
    
    // Permite que o objeto validado possa ser qualquer um dos tipos a seguir:
    oneOf: [
      { $ref: "#/definitions/DockButtonAppsByTag" },
      { $ref: "#/definitions/DockButtonApp" },
      { $ref: "#/definitions/DockButtonAction" },
      { $ref: "#/definitions/DockButtonDropdown" }
    ],
  
    definitions: {
      /**
       * Equivale à interface DockButtonBase
       */
      DockButtonBase: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The id for the dock entry."
          },
          visible: {
            type: "boolean",
            description: "Is the dock entry visible."
          },
          tooltip: {
            type: "string",
            description: "The tooltip to be shown for this button/entry."
          },
          iconUrl: {
            type: "string",
            description: "The icon to use to distinguish this entry from others."
          },
          conditions: {
            type: "array",
            description: "Condition to determine if the item should be shown.",
            items: {
              type: "string"
            }
          }
        },
        required: ["id"],        // Em DockButtonBase, 'id' é obrigatório
        additionalProperties: false
      },
  
      /**
       * Equivale à interface DockButtonAppsByTag
       */
      DockButtonAppsByTag: {
        allOf: [
          { $ref: "#/definitions/DockButtonBase" },
          {
            type: "object",
            properties: {
              display: {
                type: "string",
                enum: ["individual", "group"],
                description: "Should this entry show a single app or a group of apps."
              },
              tags: {
                type: "array",
                description: "Tags utilizadas para encontrar um app ou um conjunto de apps.",
                items: { type: "string" }
              },
              noEntries: {
                type: "string",
                description: "Text to display if there are no entries because there are no tagged apps."
              }
            },
            required: ["display"],
            additionalProperties: false
          }
        ]
      },
  
      /**
       * Equivale à interface DockButtonApp
       */
      DockButtonApp: {
        allOf: [
          { $ref: "#/definitions/DockButtonBase" },
          {
            type: "object",
            properties: {
              appId: {
                type: "string",
                description: "Launch an app by its id."
              }
            },
            required: ["appId"],
            additionalProperties: false
          }
        ]
      },
  
      /**
       * Equivale à interface DockButtonAction
       */
      DockButtonAction: {
        allOf: [
          { $ref: "#/definitions/DockButtonBase" },
          {
            type: "object",
            properties: {
              action: {
                type: "object",
                description: "Launch an action.",
                properties: {
                  id: {
                    type: "string",
                    description: "The id of the action to fire."
                  },
                  customData: {
                    description: "Data that should be passed to the action."
                  }
                },
                required: ["id"],
                additionalProperties: false
              }
            },
            required: ["action"],
            additionalProperties: false
          }
        ]
      },
  
      /**
       * Equivale à interface DockButtonDropdown
       */
      DockButtonDropdown: {
        allOf: [
          { $ref: "#/definitions/DockButtonBase" },
          {
            type: "object",
            properties: {
              options: {
                type: "array",
                description: "List of button options.",
                items: {
                  // Aqui aceitamos que cada item do dropdown possa ser qualquer um dos quatro tipos:
                  oneOf: [
                    { $ref: "#/definitions/DockButtonAppsByTag" },
                    { $ref: "#/definitions/DockButtonApp" },
                    { $ref: "#/definitions/DockButtonAction" },
                    { $ref: "#/definitions/DockButtonDropdown" }
                  ]
                }
              },
              noEntries: {
                type: "string",
                description: "Text to display if there are no entries because conditions have excluded options."
              }
            },
            required: ["options"],
            additionalProperties: false
          }
        ]
      }
    }
  } as const;