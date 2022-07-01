import {
  CreditCardOutlined,
  CodeSandboxOutlined,
  BankOutlined,
  DollarOutlined,
  FileProtectOutlined,
  LaptopOutlined,
  SketchOutlined
} from "@ant-design/icons";

const paymentCategories = [
    { num: "1", desc: "Credit/Debit Card", icon: <CreditCardOutlined /> },
    { num: "2", desc: "Bank Transfer", icon: <BankOutlined /> },
    { num: "3", desc: "Online Banking", icon: <FileProtectOutlined /> },
    { num: "4", desc: "Remittance", icon: <DollarOutlined /> },
    { num: "5", desc: "Online Payment", icon: <LaptopOutlined /> },
    { num: "6", desc: "Cash on Delivery", icon: <CodeSandboxOutlined /> },
    { num: "7", desc: "Cryptocurrency", icon: <SketchOutlined /> },
];

export default paymentCategories;