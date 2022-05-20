import {
    Button,
    Carousel,
    ConfigProvider,
    DatePicker,
    Dropdown,
    Input,
    InputNumber,
    Menu,
    Modal,
    Select,
    Switch,
    Table,
    Tag,
    Tooltip,
    Pagination,
    Popover,
    Tabs,
    Checkbox,
    Breadcrumb
} from "ant-design-vue";

import IconSvg from "@/components/IconSvg";

const { Item: MenuItem } = Menu;
const { TabPane } = Tabs;
const { Item: BreadcrumbItem } = Breadcrumb
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
    app.component("a-tag", Tag);
    app.component("a-pagination", Pagination);
    app.component("a-popover", Popover);
    app.component("a-tabs", Tabs);
    app.component("a-tab-pane", TabPane);
    app.component("a-checkbox", Checkbox);
    app.component("a-breadcrumb", Breadcrumb);
    app.component("a-breadcrumb-item", BreadcrumbItem);
}
