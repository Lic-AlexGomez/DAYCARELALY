import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext"; 
import { Search, Edit, Trash } from "lucide-react";

const TeacherClasses = () => {
  const { store, actions } = useContext(Context); 
  const { teacherClasses } = store;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    actions.getTeacherClasses();
  }, []); 
  const filteredClasses = teacherClasses.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
  <h3 className="tw-text-xl tw-font-semibold tw-mb-4">Mis Clases</h3>
  <div className="tw-mb-4">
    <div className="tw-relative">
      <input
        type="text"
        placeholder="Buscar clase..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-pl-10 tw-pr-4 tw-py-2"
      />
      <Search className="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
    </div>
  </div>
  <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
    <table className="tw-min-w-full tw-divide-y tw-divide-gray-200">
      <thead className="tw-bg-gray-50">
        <tr>
          <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
            Nombre de la Clase
          </th>
          <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
            Edad
          </th>
          <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
            Hora
          </th>
          <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
            Capacidad
          </th>
        </tr>
      </thead>
      <tbody className="tw-bg-white tw-divide-y tw-divide-gray-200">
        {filteredClasses.map((cls) => (
          <tr key={cls.id}>
            <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{cls.name}</td>
            <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{cls.age}</td>
            <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{cls.time}</td>
            <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{cls.capacity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
};

export default TeacherClasses;
