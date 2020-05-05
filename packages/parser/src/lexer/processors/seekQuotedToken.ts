import InvalidCharacterError from "../../error/InvalidCharacterError";
import { createQuotedToken, QuotedToken } from "../Token";
import { SeekProcessor } from "../LexerProcessor";

const seekQuotedToken: SeekProcessor<QuotedToken> = (context) => {
  // we assume that quote is a valid QuoteSymbol
  const quote = context.buffer.charAt(context.position);
  let endPosition = context.position;

  while (endPosition < context.length) {
    endPosition = context.buffer.indexOf(quote, endPosition + 1);

    if (endPosition === -1) {
      throw InvalidCharacterError.createForUnclosedQuote(context.position, context.buffer);
    }

    // scan back for escape characters
    let escaped = false;
    for (
      let scanPosition = endPosition - 1;
      context.buffer[scanPosition] === "\\" && scanPosition > context.position;
      scanPosition--
    ) {
      escaped = !escaped;
    }

    if (!escaped) {
      // it's not escaped quote - we've found terminating quote
      break;
    }
  }

  const value = context.buffer.substring(context.position, endPosition + 1);
  const token = createQuotedToken(value, context.position);
  context.position = endPosition + 1;

  return token;
};

export default seekQuotedToken;
