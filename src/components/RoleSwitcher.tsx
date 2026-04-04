import type { Role } from "../types";

interface Props {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleSwitcher = ({ role, setRole }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <select
        className="bg-transparent border border-slate-200 dark:border-slate-600 p-2 rounded-xl text-slate-800 dark:text-white outline-none cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors duration-200"
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
      >
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
};

export default RoleSwitcher;