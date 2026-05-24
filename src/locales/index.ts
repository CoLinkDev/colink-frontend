import { createI18n } from 'vue-i18n'
import en from './en'
import zhCN from './zh-CN'
import ja from './ja'

const getBrowserLocale = () => {
  const lang = navigator.language
  if (lang.startsWith('zh')) return 'zh-CN'
  if (lang.startsWith('ja')) return 'ja'
  return 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || getBrowserLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-CN': zhCN,
    ja
  }
})

export default i18n
