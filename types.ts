export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  createdAt: number;
  notes?: string;
}

export interface GoalFormData {
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  notes?: string;
}

export const CATEGORIES = [
  "Tecnología",
  "Viajes",
  "Hogar",
  "Vehículo",
  "Ropa/Moda",
  "Educación",
  "Entretenimiento",
  "Otros"
];