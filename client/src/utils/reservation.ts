import { DateConst } from "@root/constants/date";

export const extractCustomerComment = (comment: string) => {
  // e.g. Test 3[Jan 11 2024  9:54AM] <b>system</b>: this case was booked online.<br>
  const regex = /\[(.*?)\]/g;
  let matches: RegExpExecArray | null;
  
  while ((matches = regex.exec(comment))) {
    console.log({matches});
    for (const match of matches) {
      if (DateConst.monthShortNames.find(month => match.startsWith(month) && (match.endsWith("AM") || match.endsWith("PM")))) {
        const pattern = `[${match}]`;
        const pos = comment.indexOf(pattern);
        return comment.slice(0, pos);
      }
    }
  }
  return comment;
};