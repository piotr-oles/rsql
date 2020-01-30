import Token from "./Token";
import LexerContext from "./LexerContext";

type LexerProcessor<TOutput> = (context: LexerContext) => TOutput;
type SeekProcessor<TToken extends Token = Token> = LexerProcessor<TToken | null>;
type SkipProcessor = LexerProcessor<void>;
type ScanProcessor<TSymbol extends string> = LexerProcessor<TSymbol | null>;

export default LexerProcessor;
export { SeekProcessor, SkipProcessor, ScanProcessor };
