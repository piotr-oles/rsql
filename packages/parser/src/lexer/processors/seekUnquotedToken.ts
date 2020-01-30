import { ReservedChar, ReservedChars } from "@rsql/definitions";
import { createUnquotedToken, UnquotedToken } from "../Token";
import { SeekProcessor } from "../LexerProcessor";

const seekUnquotedToken: SeekProcessor<UnquotedToken> = (context) => {
  let endPosition = context.position + 1;

  while (
    endPosition < context.length &&
    ReservedChars.indexOf(context.buffer.charAt(endPosition) as ReservedChar) === -1
  ) {
    endPosition++;
  }

  const token = createUnquotedToken(context.buffer.substring(context.position, endPosition), context.position);
  context.position = endPosition;

  return token;
};

export default seekUnquotedToken;
