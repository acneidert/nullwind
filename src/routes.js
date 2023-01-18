import QuickStart from "./docs/getting-started/QuickStart.mdx";
import Button from "./docs/components/Button.mdx";
import Icons from "./docs/components/Icons.mdx";
import Alert from "./docs/components/Alert.mdx";
import Table from "./docs/components/Table.mdx";
import Tab from "./docs/components/Tab.mdx";
import Pagination from "./docs/components/Pagination.mdx";
import Modal from "./docs/components/Modal/Modal.mdx";
import Input from "./docs/forms/Input.mdx";
import Textarea from "./docs/forms/Textarea.mdx";
import Toggle from "./docs/forms/Toggle.mdx";
import Checkbox from "./docs/forms/Checkbox.mdx";
import Radio from "./docs/forms/Radio.mdx";
import Select from "./docs/forms/Select.mdx";

export const routes = [
  {
    title: "Getting Started",
    routes: [
      {
        title: "Quick Start",
        path: "/",
        component: QuickStart,
      },
    ],
  },
  {
    title: "Components",
    routes: [
      {
        title: "Alert",
        path: "/components/alert",
        component: Alert,
      },
      {
        title: "Button",
        path: "/components/button",
        component: Button,
      },
      {
        title: "Icons",
        path: "/components/icons",
        component: Icons,
      },
      {
        title: "Modal",
        path: "/components/modal",
        component: Modal,
      },
      {
        title: "Pagination",
        path: "/components/pagination",
        component: Pagination,
      },
      {
        title: "Tab",
        path: "/components/tab",
        component: Tab,
      },
      {
        title: "Table",
        path: "/components/table",
        component: Table,
      },
    ],
  },
  {
    title: "Forms",
    routes: [
      {
        title: "Checkbox",
        path: "/components/checkbox",
        component: Checkbox,
      },
      {
        title: "Input",
        path: "/components/input",
        component: Input,
      },
      {
        title: "Radio",
        path: "/components/radio",
        component: Radio,
      },
      {
        title: "Select",
        path: "/components/select",
        component: Select,
      },
      {
        title: "Textarea",
        path: "/components/textarea",
        component: Textarea,
      },
      {
        title: "Toggle",
        path: "/components/toggle",
        component: Toggle,
      },
    ],
  },
];
