import { I18nManager, Platform, DevSettings } from 'react-native';
import i18n from '../i18n';

export async function applyRtlIfNeeded(lang?: string) {
  const current = lang ?? i18n.resolvedLanguage ?? i18n.language ?? 'en';
  const isRTL = current.startsWith('ar');

  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      DevSettings.reload();
    }
  }
}
