import I18n from 'react-native-i18n';
import en from './languages/english.json';
import af from './languages/af.json';
import am from './languages/am.json';
import ar from './languages/ar.json';
import bg from './languages/bg.json';
import ca from './languages/ca.json';
import cs from './languages/cs.json';
import da from './languages/da.json';
import de from './languages/de.json';
import el from './languages/el.json';
import es from './languages/es.json';
import et from './languages/et.json';
import fi from './languages/fi.json';
import fil from './languages/fil.json';
import fr from './languages/fr.json';
import he from './languages/he.json';
import hi from './languages/hi.json';
import hr from './languages/hr.json';
import hu from './languages/hu.json';
import id from './languages/id.json';
import it from './languages/it.json';
import ja from './languages/ja.json';
import ko from './languages/ko.json';
import lt from './languages/lt.json';
import lv from './languages/lv.json';
import ms from './languages/ms.json';
import nb from './languages/nb.json';
import nl from './languages/nl.json';
import no from './languages/no.json';
import pl from './languages/pl.json';
import pt from './languages/pt.json';
import ro from './languages/ro.json';
import ru from './languages/ru.json';
import sk from './languages/sk.json';
import sl from './languages/sl.json';
import sr from './languages/sr.json';
import sv from './languages/sv.json';
import sw from './languages/sw.json';
import th from './languages/th.json';
import tr from './languages/tr.json';
import uk from './languages/uk.json';
import vi from './languages/vi.json';
import zh from './languages/zh.json';
import zu from './languages/zu.json';


I18n.fallbacks = true;

// English language is the main language for fall back:
I18n.translations = { en };

const languageCode = I18n.locale.substr(0, 2);

// All other translations for the app goes to the respective language file:
function setLanguage() {
  switch (languageCode) {
    case 'af':
      return I18n.translations.af = af;
    case 'am':
      return I18n.translations.am = am;
    case 'ar':
      return I18n.translations.ar = ar;
    case 'bg':
      return I18n.translations.bg = bg;
    case 'ca':
      return I18n.translations.ca = ca;
    case 'cs':
      return I18n.translations.cs = cs;
    case 'da':
      return I18n.translations.da = da;
    case 'de':
      return I18n.translations.de = de;
    case 'el':
      return I18n.translations.el = el;
    case 'es':
      return I18n.translations.es = es;
    case 'et':
      return I18n.translations.et = et;
    case 'fi': {
      const addCode = I18n.locale.substr(0, 3);
      if (addCode === 'fil') {
        return I18n.translations.fil = fil;
      }
      return I18n.translations.fi = fi;
    }
    case 'fr':
      return I18n.translations.fr = fr;
    case 'he':
      return I18n.translations.he = he;
    case 'hi':
      return I18n.translations.hi = hi;
    case 'hr':
      return I18n.translations.hr = hr;
    case 'hu':
      return I18n.translations.hu = hu;
    case 'id':
      return I18n.translations.id = id;
    case 'it':
      return I18n.translations.it = it;
    case 'ja':
      return I18n.translations.ja = ja;
    case 'ko':
      return I18n.translations.ko = ko;
    case 'lt':
      return I18n.translations.lt = lt;
    case 'lv':
      return I18n.translations.lv = lv;
    case 'ms':
      return I18n.translations.ms = ms;
    case 'nb':
      return I18n.translations.nb = nb;
    case 'nl':
      return I18n.translations.nl = nl;
    case 'no':
      return I18n.translations.no = no;
    case 'pl':
      return I18n.translations.pl = pl;
    case 'pt':
      return I18n.translations.pt = pt;
    case 'ro':
      return I18n.translations.ro = ro;
    case 'ru':
      return I18n.translations.ru = ru;
    case 'sl':
      return I18n.translations.sl = sl;
    case 'sk':
      return I18n.translations.sk = sk;
    case 'sr':
      return I18n.translations.sr = sr;
    case 'sv':
      return I18n.translations.sv = sv;
    case 'sw':
      return I18n.translations.sw = sw;
    case 'th':
      return I18n.translations.th = th;
    case 'tr':
      return I18n.translations.tr = tr;
    case 'uk':
      return I18n.translations.uk = uk;
    case 'vi':
      return I18n.translations.vi = vi;
    case 'zh':
      return I18n.translations.zh = zh;
    case 'zu':
      return I18n.translations.zu = zu;
    default:
      break;
  }
  return null;
}

setLanguage();
