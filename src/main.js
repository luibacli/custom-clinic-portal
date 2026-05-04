import { createApp, watch } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import * as Sentry from '@sentry/vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import { Form } from '@primevue/forms';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Chart from 'primevue/chart';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import Dialog from 'primevue/dialog';
import TabPanel from 'primevue/tabpanel';
import ProgressBar from 'primevue/progressbar';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import SplitButton from 'primevue/splitbutton';
import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';
import Menu from 'primevue/menu';
import InputGroup from 'primevue/inputgroup';
import ToggleSwitch from 'primevue/toggleswitch';
import MultiSelect from 'primevue/multiselect';
import Textarea from 'primevue/textarea';
import Image from 'primevue/image';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Tooltip from 'primevue/tooltip';
import Password from 'primevue/password';
import { Card, Button, Select, InputText, DatePicker, Drawer, PanelMenuStyle, PanelMenu } from 'primevue';
import { createPinia } from 'pinia';
import { useTenantStore } from './stores/tenantStore';
import { useAuthTenantStore } from './stores/authTenantStore';
import { applyBrandingVars } from './composables/useBranding';

const bootstrap = async () => {
  const app = createApp(App);
  const pinia = createPinia();

  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [Sentry.browserTracingIntegration({ router })],
      tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
      environment: import.meta.env.MODE,
    });
  }

  app.use(pinia);
  app.use(router);

  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        cssLayer: {
          name: 'primevue',
          order: 'theme, base, primevue'
        },
        darkModeSelector: '.my-app-dark'
      }
    }
  });

  app.use(ToastService);

  app.component('DataTable', DataTable);
  app.component('Column', Column);
  app.component('Tag', Tag);
  app.component('Chart', Chart);
  app.component('Card', Card);
  app.component('Button', Button);
  app.component('Select', Select);
  app.component('InputText', InputText);
  app.component('DatePicker', DatePicker);
  app.component('Tabs', Tabs);
  app.component('Tab', Tab);
  app.component('Toast', Toast);
  app.component('TabList', TabList);
  app.component('TabPanels', TabPanels);
  app.component('TabPanel', TabPanel);
  app.component('Dialog', Dialog);
  app.component('ProgressBar', ProgressBar);
  app.component('Accordion', Accordion);
  app.component('AccordionPanel', AccordionPanel);
  app.component('AccordionHeader', AccordionHeader);
  app.component('AccordionContent', AccordionContent);
  app.component('Form', Form);
  app.component('SplitButton', SplitButton);
  app.component('Menubar', Menubar);
  app.component('PanelMenu', PanelMenu);
  app.component('Menu', Menu);
  app.component('Avatar', Avatar);
  app.component('InputGroup', InputGroup);
  app.component('Image', Image);
  app.component('ToggleSwitch', ToggleSwitch);
  app.component('MultiSelect', MultiSelect);
  app.component('Textarea', Textarea);
  app.component('Drawer', Drawer);
  app.component('IconField', IconField);
  app.component('InputIcon', InputIcon);
  app.component('Password', Password);

  app.directive('tooltip', Tooltip);

const tenantStore = useTenantStore(pinia);
const authTenantStore = useAuthTenantStore(pinia);

try {
  const host = window.location.hostname;
  const baseDomain = 'myclinicaccess.com';

  const reservedSubdomains = [
    'www',
    'dev',
    'app',
    'admin',
    'api'
  ];

  const isLocalhost =
    host === 'localhost' ||
    host === '127.0.0.1';

  const isBaseDomain =
    host === baseDomain;

  const isSubdomain =
    host.endsWith(`.${baseDomain}`);

  let shouldInitTenant = false;

  if (!isLocalhost && !isBaseDomain && isSubdomain) {
    const subdomain = host.replace(`.${baseDomain}`, '');

    if (!reservedSubdomains.includes(subdomain)) {
      shouldInitTenant = true;
    }
  }

  // Only initialize tenant context for real clinic subdomains
  if (shouldInitTenant) {
    await tenantStore.initTenant();
  }

  authTenantStore.checkToken();

  watch(
    () => tenantStore.tenant?.name,
    (tenantName) => {
      document.title = tenantName
        ? `${tenantName} | My Clinic Access`
        : 'My Clinic Access';
    },
    { immediate: true }
  );

  watch(
    () => tenantStore.tenant?.branding,
    (branding) => applyBrandingVars(branding),
    { immediate: true, deep: true }
  );
} catch (error) {
  console.error('Bootstrap auth/init failed:', error);
}

  await router.isReady();
  app.mount('#app');
};

bootstrap();
