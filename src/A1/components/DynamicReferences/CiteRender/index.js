import Cite from 'citation-js';
import './csl.css';
import chicago from './styles/chicago-fullnote-bibliography.csl';
import mla from './styles/mla.csl';
// import ieeeWeb from './styles/ieee-web.csl';

let config = Cite.plugins.config.get('@csl');

config.templates.add('chicago', chicago);
config.templates.add('mla', mla);
// config.templates.add('ieee-web', ieeeWeb);

export default Cite;
