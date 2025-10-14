import { Landing } from "../layouts/Landing";
import { Article } from "../layouts/Article";
import { Statistics } from "../layouts/Statistics";
import { Table } from "../layouts/Table";
import { AddSensor } from "../layouts/AddSensor";
import { AddValues } from "../layouts/AddValues";
import { User } from "../layouts/User";

const parent = "Clima";

export const NavigationMap = {
  Init: { 
    label: "Inicio", 
    parent: "Clima", 
    role_id: 3, 
    icon: "house", 
    component: Landing, 
    path: "init" 
  },
  Articles: { 
    label: "Artículos", 
    parent: "Clima", 
    role_id: 3, 
    icon: "newspaper", 
    component: Article, 
    path: "articles" 
  },
  Statistics: { 
    label: "Estadísticas", 
    parent: "Clima", 
    role_id: 3, 
    icon: "chart-column", 
    component: Statistics, 
    path: "statistics" 
  },
  Tables: { 
    label: "Tablas", 
    parent: "Clima", 
    role_id: 3, 
    icon: "table", 
    component: Table, 
    path: "table" 
  },
  AddSensor: { 
    label: "Registrar Sensor", 
    parent: "Clima", 
    role_id: 2, 
    icon: "chart-line", 
    component: AddSensor, 
    path: "add-sensor" 
  },
  AddValues: { 
    label: "Registrar Valores", 
    parent: "Clima", 
    role_id: 2, 
    icon: "chart-simple", 
    component: AddValues, 
    path: "add-values" 
  },
  User: { 
    label: "Perfil", 
    parent: "Clima", 
    role_id: 3, 
    icon: "user", 
    component: User, 
    path: "user" 
  },
};
