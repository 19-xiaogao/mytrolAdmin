import {
  Dropdown,
  Menu,
  Modal,
  Button,
  ConfigProvider,
  Table,
  Tooltip,
  Carousel,
  Input,
  InputNumber,
  DatePicker,
  Switch,
  Select,
} from "ant-design-vue";

import IconSvg from "@/components/IconSvg";
const { Item: MenuItem } = Menu;

export default function (app) {
  app.component("icon-svg", IconSvg);
  app.component("a-dropdown", Dropdown);
  app.component("a-menu", Menu);
  app.component("a-menu-item", MenuItem);
  app.component("a-modal", Modal);
  app.component("a-button", Button);
  app.component("a-config-provider", ConfigProvider);
  app.component("a-table", Table);
  app.component("a-tooltip", Tooltip);
  app.component("a-carousel", Carousel);
  app.component("a-input", Input);
  app.component("a-input-number", InputNumber);
  app.component("a-date-picker", DatePicker);
  app.component("a-switch", Switch);
  app.component("a-select", Select);
  app.component("a-select-option", Select.Option);
}
