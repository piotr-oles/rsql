import { SkipProcessor } from "../LexerProcessor";

const WhitespaceChars = [" ", "\n", "\t", "\r"];

const skipWhitespace: SkipProcessor = (context) => {
  while (context.position < context.length && WhitespaceChars.indexOf(context.buffer.charAt(context.position)) !== -1) {
    context.position++;
  }
};

export default skipWhitespace;
