import List from '../../views/pages/list.svelte'
import Detail from '../../views/pages/detail.svelte'
import Accessibility from '../../views/pages/accessibility.svelte'
import Faq from '../../views/pages/faq.svelte'
import Impressum from '../../views/pages/impressum.svelte'
import Datapolicy from '../../views/pages/datapolicy.svelte'
import Info from '../../views/pages/info.svelte'
import NotFound from '../../views/pages/404.svelte'

export const routes = {
  '/': List,
  '/detail/:id': Detail,
  '/barrierefreiheit': Accessibility,
  '/faq': Faq,
  '/impressum': Impressum,
  '/datenschutz': Datapolicy,
  '/info': Info,
  '/404': NotFound,
  '*': NotFound
}
