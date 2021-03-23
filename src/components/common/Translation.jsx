import { connect } from "react-redux";
import { DEFAULT_LANGUAGE } from "../../utils/constants";

const mapStateToProps = state => {
  return {
    translations: state.translations,
    lang: state.navigation.currentLang,
  };
};


const Translation = ({ translations, lang, id}) => {
  if (!translations[id]) return ""

  const translatedString = translations[id][lang] ? translations[id][lang] : translations[id][DEFAULT_LANGUAGE]
  return translatedString;
}


export default connect(mapStateToProps, null)(Translation);
