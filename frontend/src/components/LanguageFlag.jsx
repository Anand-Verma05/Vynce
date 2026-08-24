import { LANGUAGE_TO_FLAG } from "../constants";

const LanguageFlag = ({ language }) => {
  if (!language) return null;
  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];
  return countryCode ? <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt={`${langLower} flag`} className="mr-1 inline-block h-3" /> : null;
};

export default LanguageFlag;
