// Tokenizer doc: https://serhii.io/posts/writing-your-own-lexer-with-simple-steps?utm_source=chatgpt.com

export const tokenType = {
    h1: "#",
    h2: "##",
    h3: "###",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    bold: "bold",
    italic: "italic"
} as const;

type TokenItem = typeof tokenType[keyof typeof tokenType];

type Token = {
    type: TokenItem,
    literal: string
};

function createToken(type: TokenItem, literal: string): Token {
    return { type, literal }
}

    
    

