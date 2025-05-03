import { Gender, UserRole } from './enums';
import type { Subject } from '../subject';

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  phone?: string | null;
  birthDate?: string | null;
  gender?: Gender | null;
  grade?: string | null;
  school?: string | null;
  teachingSubject?: string | null;
  childGrade?: string | null;
  interestedSubjects?: Subject[] | null;
}