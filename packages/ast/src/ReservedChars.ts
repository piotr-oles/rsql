const ReservedChars = ['"', "'", "(", ")", ";", ",", "=", "!", "~", "<", ">", " ", "\n", "\t", "\r"] as const;
type ReservedChar = typeof ReservedChars[number];

export { ReservedChars, ReservedChar };
