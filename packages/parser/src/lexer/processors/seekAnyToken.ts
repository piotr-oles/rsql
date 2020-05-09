import { createErrorForUnexpectedCharacter } from "../../Error";
import { AnyToken } from "../Token";
import seekComparisonCustomOperatorToken from "./seekComparisonCustomOperatorToken";
import seekComparisonOperatorToken from "./seekComparisonOperatorToken";
import seekLogicCanonicalOperatorToken from "./seekLogicCanonicalOperatorToken";
import seekLogicVerboseOperatorToken from "./seekLogicVerboseOperatorToken";
import { SeekProcessor } from "../LexerProcessor";
import seekParenthesisToken from "./seekParenthesisToken";
import seekQuotedToken from "./seekQuotedToken";
import seekUnquotedToken from "./seekUnquotedToken";
import skipWhitespace from "./skipWhitespace";

const seekAnyToken: SeekProcessor<AnyToken> = (context) => {
  // first skip all whitespace chars
  skipWhitespace(context);

  if (context.position >= context.length) {
    return null;
  }

  // then decide what to do based on the current char
  const char = context.buffer.charAt(context.position);
  let token: AnyToken | null = null;

  switch (char) {
    // single char symbols
    case "'":
    case '"':
      token = seekQuotedToken(context);
      break;

    // single char symbols
    case "(":
    case ")":
      token = seekParenthesisToken(context);
      break;

    // single char symbols
    case ",":
    case ";":
      token = seekLogicCanonicalOperatorToken(context);
      break;

    // multi char symbols for comparison operator
    case "=":
    case "!":
    case "~":
    case "<":
    case ">":
      token = seekComparisonOperatorToken(context);
      if (!token && char === "=") {
        token = seekComparisonCustomOperatorToken(context);
      }
      break;

    // unreserved char
    default:
      // there are VerboseLogicOperators (and, or) that uses not reserved chars
      token = seekLogicVerboseOperatorToken(context);

      // if it's not an OperatorToken, process UnquotedToken
      if (!token) {
        token = seekUnquotedToken(context);
      }
  }

  if (!token) {
    throw createErrorForUnexpectedCharacter(context.position, context.buffer);
  }

  return token;
};

export default seekAnyToken;
