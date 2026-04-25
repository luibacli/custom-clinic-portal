import { createApp, watch } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
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
import Image from 'primevue/image';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Tooltip from 'primevue/tooltip';
import { Card, Button, Select, InputText, DatePicker, Drawer, PanelMenuStyle, PanelMenu } from 'primevue';
import { createPinia } from 'pinia';
import { useTenantStore } from './stores/tenantStore';
import { useAuthTenantStore } from './stores/authTenantStore';

const bootstrap = async () => {
  const app = createApp(App);
  const pinia = createPinia();

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
  app.component('Drawer', Drawer);
  app.component('IconField', IconField);
  app.component('InputIcon', InputIcon);

  app.directive('tooltip', Tooltip);

  const tenantStore = useTenantStore(pinia);
  const authTenantStore = useAuthTenantStore(pinia);

  try {
    // This is a tenant-only portal — always initialize tenant context
    await tenantStore.initTenant();
    authTenantStore.checkToken();

    watch(
      () => tenantStore.tenant?.name,
      (tenantName) => {
        document.title = tenantName
          ? `${tenantName} | Custom Clinic Portal PH`
          : 'Custom Clinic Portal PH';
      },
      { immediate: true }
    );
  } catch (error) {
    console.error('Bootstrap auth/init failed:', error);
  }

  await router.isReady();
  app.mount('#app');
};

bootstrap();
